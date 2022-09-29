import capitalize from 'lodash/capitalize';
import neo4j from 'neo4j-driver';
import {ENV} from '~/env';
import type {
  ActedInEdge,
  MovieCredits,
  MovieDetails,
  MovieNode,
  MovieResponse,
  PersonNode,
  RelatedRoles,
  TvCredits,
  TvDetails,
  TvNode,
  TvResponse
} from '~/types';
import {CypherQuery} from './cypher.server';
import {getRecords} from './util.server';

const {NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD} = ENV;

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

export const Graph = {
  async getMovie(id: string): Promise<MovieResponse | null> {
    const session = driver.session();
    const preQuery = `
      MATCH (actor:Person)-[role:ACTED_IN]->(title:Movie {id: $id})
      RETURN actor,role,title
      ORDER BY role.order ASC, actor.popularity DESC
    `;

    const results = await session.readTransaction(tx => tx.run(preQuery, {id}));
    const records = getRecords(results.records);

    if (records.length === 0) {
      return null;
    }

    return {
      title: records[0].title as MovieNode,
      cast: records.map(credit => ({
        actor: credit.actor as PersonNode,
        role: credit.role as ActedInEdge
      }))
    };
  },

  async createMovie(details: MovieDetails & {credits: MovieCredits}): Promise<MovieResponse> {
    const builder = new CypherQuery();
    const titleProperties: Omit<MovieNode, 'id'> = {
      type: 'movie',
      name: details.title,
      original_name: details.original_title,
      runtime: details.runtime,
      popularity: details.popularity,
      budget: details.budget,
      imdb_id: details.imdb_id,
      original_language: details.original_language,
      overview: details.overview,
      release_date: details.release_date,
      revenue: details.revenue,
      tagline: details.tagline,
      status: details.status,
      backdrop_path: details.backdrop_path || '',
      poster_path: details.poster_path || ''
    };

    const title = builder.node({
      label: 'Movie',
      id: details.id.toString(),
      properties: titleProperties
    });

    details.credits.cast.forEach(credit => {
      const personProperties: Omit<PersonNode, 'id'> = {
        name: credit.name,
        popularity: credit.popularity,
        profile_path: credit.profile_path,
        gender: credit.gender,
        known_for_department: credit.known_for_department
      };
      const person = builder.node({
        label: 'Person',
        id: credit.id.toString(),
        properties: personProperties
      });
      const edgeProperties: Omit<ActedInEdge, 'character_image'> = {
        credit_id: credit.credit_id,
        character_name: credit.character,
        order: credit.order
      };
      builder.merge(
        person,
        {
          label: 'ACTED_IN',
          properties: edgeProperties
        },
        title
      );
    });
    const [query, args] = builder.build();
    const session = driver.session();
    await session.writeTransaction(tx => tx.run(query, args));
    return Graph.getMovie(details.id.toString()) as Promise<MovieResponse>;
  },

  async getTv(id: string): Promise<TvResponse | null> {
    const session = driver.session();
    const query = `
      MATCH (actor:Person)-[role:ACTED_IN]->(title:Tv {id: $id})
      RETURN actor,role,title
      ORDER BY role.order ASC, actor.popularity DESC
    `;
    const results = await session.readTransaction(tx => tx.run(query, {id}));
    const records = getRecords(results.records);
    if (records.length === 0) {
      return null;
    }

    return {
      title: records[0].title as TvNode,
      cast: records.map(credit => ({
        actor: credit.actor as PersonNode,
        role: credit.role as ActedInEdge
      }))
    };
  },

  async createTv(details: TvDetails & {credits: TvCredits}): Promise<TvResponse> {
    const builder = new CypherQuery();
    const titleProperties: Omit<TvNode, 'id'> = {
      type: 'tv',
      poster_path: details.poster_path,
      backdrop_path: details.backdrop_path,
      name: details.name,
      first_air_date: details.first_air_date,
      last_air_date: details.last_air_date,
      number_of_episodes: details.number_of_episodes,
      number_of_seasons: details.number_of_seasons,
      popularity: details.popularity,
      original_name: details.original_name,
      origin_country: details.origin_country,
      original_language: details.original_language,
      overview: details.overview,
      status: details.status,
      tagline: details.tagline,
      episode_run_time: details.episode_run_time,
      languages: details.languages
    };
    const title = builder.node({
      id: details.id.toString(),
      label: 'Tv',
      properties: titleProperties
    });
    details.credits.cast.forEach(credit => {
      const personProperties: Omit<PersonNode, 'id'> = {
        name: credit.name,
        popularity: credit.popularity,
        profile_path: credit.profile_path,
        known_for_department: credit.known_for_department,
        gender: credit.gender
      };
      const person = builder.node({
        label: 'Person',
        id: credit.id.toString(),
        properties: personProperties
      });
      const edge: Omit<ActedInEdge, 'character_image'> = {
        credit_id: credit.credit_id,
        character_name: credit.character,
        order: credit.order
      };
      builder.merge(
        person,
        {
          label: 'ACTED_IN',
          properties: edge
        },
        title
      );
    });

    const [query, args] = builder.build();
    const session = driver.session();
    await session.writeTransaction(tx => tx.run(query, args));
    return Graph.getTv(details.id.toString()) as Promise<TvResponse>;
  },

  async hasUserWatchedTitle(userId: string, titleId: string): Promise<boolean> {
    const query = `
      RETURN exists((:User{id:$userId})-[:WATCHED]->({id:$titleId}))
    `;
    const session = driver.session();
    const results = await session.readTransaction(tx => tx.run(query, {userId, titleId}));
    const exists = results.records && results.records[0] && results.records[0].get(0);
    return Boolean(exists);
  },

  async relatedRoles(userId: string, titleId: string): Promise<RelatedRoles[]> {
    const query = `
      MATCH (user:User {id: $userId})
      MATCH (pivot {id: $titleId})
      MATCH (actor:Person)-[role:ACTED_IN]->(title)
      WHERE (user)-[:WATCHED]->(title) AND (actor)-[:ACTED_IN]->(pivot) and title <> pivot
      return actor,title,role
    `;
    const session = driver.session();
    const results = await session.readTransaction(tx => tx.run(query, {userId, titleId}));
    const records = getRecords(results.records);

    if (records.length === 0) {
      return [];
    }

    return records.reduce((roles, record) => {
      if (roles.find(role => role.actor.id === record.actor.id)) {
        return roles.map(role =>
          role.actor.id === record.actor.id
            ? ({
                ...role,
                roles: [
                  ...role.roles,
                  {
                    title: record.title as MovieNode | TvNode,
                    role: record.role as ActedInEdge
                  }
                ]
              } as RelatedRoles)
            : role
        );
      }
      return [
        ...roles,
        {
          actor: record.actor as PersonNode,
          roles: [
            {
              title: record.title as MovieNode | TvNode,
              role: record.role as ActedInEdge
            }
          ]
        } as RelatedRoles
      ];
    }, [] as RelatedRoles[]);
  },

  async setCharacterImage(creditId: string, url: string): Promise<ActedInEdge> {
    const query = `
      MERGE ()-[role:ACTED_IN {credit_id: $creditId}]->()
      ON MATCH
        SET role.character_image = $url
      RETURN role
      `;
    const session = driver.session();
    const results = await session.writeTransaction(tx => tx.run(query, {creditId, url}));
    const {role} = getRecords(results.records)[0];
    return role as ActedInEdge;
  },

  async markTitleUnwatched(userId: string, titleId: string, titleType: 'tv' | 'movie'): Promise<boolean> {
    const label = capitalize(titleType);
    const query = `
      MATCH (user:User {id: $userId})-[w:WATCHED]->(:${label} {id: $titleId})
      DELETE w
      RETURN exists((user)-[:WATCHED]->(:${label}{id:$titleId}))
    `;
    const args = {userId, titleId};
    const session = driver.session();
    const results = await session.writeTransaction(tx => tx.run(query, args));
    return Boolean(results.records[0] && results.records[0].get(0));
  },

  async markTitleWatched(userId: string, titleId: string, titleType: 'tv' | 'movie'): Promise<boolean> {
    const label = capitalize(titleType);
    const query = `
      MERGE (user:User{id:$userId})
      MERGE (title:${label}{id:$titleId})
      MERGE (user)-[:WATCHED]->(title)
      RETURN exists((user)-[:WATCHED]->(:${label}{id:$titleId}))
    `;
    const session = driver.session();
    const results = await session.writeTransaction(tx => tx.run(query, {titleId, userId}));
    const hasWatched = Boolean(results.records[0] && results.records[0].get(0));
    return hasWatched;
  },

  async getCredit(creditId: string): Promise<[PersonNode, ActedInEdge, MovieNode | TvNode]> {
    const query = `
      MATCH (person)-[role:ACTED_IN {credit_id: $creditId}]->(title)
      RETURN person,role,title
    `;
    const session = driver.session();
    const results = await session.readTransaction(tx => tx.run(query, {creditId}));
    const records = getRecords(results.records);
    const {person, role, title} = records[0];
    return [person as PersonNode, role as ActedInEdge, title as MovieNode | TvNode];
  }
};

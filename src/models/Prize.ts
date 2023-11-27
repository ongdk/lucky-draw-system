import Postgres from "../db/Postgres";

interface Prize {
  id: string;
  title: string;
  daily_quota: null | number;
  total_quota: null | number;
  probability: number;
  active: boolean;
}

export type PrizeProbability = Pick<Prize, "id" | "title" | "probability">;

const getPrizesProbabilities = async () => {
  const query = {
    text: `
    SELECT
      id,
      title,
      probability
    FROM
      PRIZE
    WHERE
      active IS TRUE;
    `,
  };
  const result = await Postgres.query(query);

  return result.rows as PrizeProbability[];
};

const getIssuedPrizes = async () => {
  const query = {
    text: `
    SELECT
      p.id,
      p.daily_quota,
      p.total_quota,
      COUNT(r.id) issued
    FROM
      prize p
      LEFT JOIN "result" r ON p.id=r.prize_id
    WHERE
      p.active IS TRUE
    GROUP BY
      p.id,
      p.daily_quota,
      p.total_quota
    `,
  };
  const result = await Postgres.query(query);

  return result.rows as {
    id: Prize["id"];
    daily_quota: Prize["daily_quota"];
    total_quota: Prize["daily_quota"];
    issued: number;
  }[];
};

export default { getPrizesProbabilities, getIssuedPrizes };

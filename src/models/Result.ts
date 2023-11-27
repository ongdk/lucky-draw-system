import Postgres from "../db/Postgres";

interface Result {
  id: string;
  user_id: string;
  prize_id: string;
  created_at: string;
  phone_no: null | string;
}

const saveResult = async (
  userId: Result["user_id"],
  prizeId: Result["prize_id"]
) => {
  const query = {
    text: `
    INSERT INTO
      result (user_id, prize_id)
    VALUES
      ($1, $2)
    RETURNING
    *
    `,
    values: [userId, prizeId],
  };
  const result = await Postgres.query(query);

  return result.rows[0] as Result;
};

const savePhoneNumber = async (
  id: Result["id"],
  phoneNumber: Result["phone_no"]
) => {
  const query = {
    text: `
    UPDATE result
    SET
      phone_no=$1
    WHERE
      id=$2
    RETURNING
    *
    `,
    values: [phoneNumber, id],
  };
  const result = await Postgres.query(query);

  return result.rows[0] as Result;
};

export default { saveResult, savePhoneNumber };

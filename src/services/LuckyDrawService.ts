import Postgres from "../db/Postgres";
import Redis from "../db/Redis";
import Prize, { PrizeProbability } from "../models/Prize";
import Result from "../models/Result";

const draw = async (username: string) => {
  // first check whether user has participated today
  const currentDate = new Date().toISOString().split("T")[0];
  const redisSetKey = `lucky-draw-${currentDate}`;
  const hasParticipated = await Redis.sIsMember(redisSetKey, username);
  if (hasParticipated) {
    return {
      message: "You have already participated. Please come back tomorrow!",
    };
  }

  // Perform the rest if the user has not participated today
  await Redis.sAdd(redisSetKey, username);

  const prizesProbabilities = await Prize.getPrizesProbabilities();

  let prize = getPrize(prizesProbabilities);

  if (prize.id !== "NO_PRIZE") {
    // check whether prize quota has been reached if a prize is drawn
    const remainingQuota = await Redis.decr(getPrizeQuotaKey(prize.id));
    if (remainingQuota < 0) {
      // when daily quota has been reached, treat result the same as NO_PRIZE
      prize = { id: "NO_PRIZE" };
    }
  }

  const result = await Result.saveResult(username, prize.id);

  const message =
    prize.id === "NO_PRIZE"
      ? "Unlucky! Please try again tomorrow!"
      : `Congratulations! You have won a ${prize.title}!`;

  return { message, result };
};

const redeem = async (id: string, phoneNumber: string) => {
  const result = await Result.savePhoneNumber(id, phoneNumber);
  if (result === undefined) {
    throw new Error("Invalid id");
  }

  return {
    message: "You have successfully redeemed your prize.",
    result,
  };
};

const refreshQuotas = async () => {
  const prizes = await Prize.getIssuedPrizes();

  const quotaUpdatePromises = prizes.map(async (prize) => {
    const key = getPrizeQuotaKey(prize.id);
    if (prize.total_quota === null) {
      // if a prize does not have a quota, remove it from redis
      await Redis.del(key);
    } else {
      const remainingQuota = prize.total_quota - prize.issued;
      if (remainingQuota > 0) {
        if (prize.daily_quota === null) {
          await Redis.set(key, remainingQuota);
        } else {
          await Redis.set(
            key,
            remainingQuota > prize.daily_quota
              ? prize.daily_quota
              : remainingQuota
          );
        }
      } else {
        // if total quota has been exceeded, set the quota as 0
        await Redis.set(key, 0);
      }
    }
  });

  await Promise.all(quotaUpdatePromises);

  console.log(`Prize quotas refreshed at ${new Date().toISOString()}`);
};

const getPrize = (prizesProbabilities: PrizeProbability[]) => {
  // Generate a random number between 0 and the total probability, i.e. 100
  const randomNumber = Math.random() * 100;

  // Iterate through the probabilities to find the winning prize
  let cumulativeProbability = 0;
  for (let i = 0; i < prizesProbabilities.length; i++) {
    cumulativeProbability += prizesProbabilities[i].probability;
    if (randomNumber < cumulativeProbability) {
      // The current prize is the winning prize
      return {
        id: prizesProbabilities[i].id,
        title: prizesProbabilities[i].title,
      };
    }
  }

  // No prize won
  return { id: "NO_PRIZE" };
};

const getPrizeQuotaKey = (prizeId: string) => {
  return `prize-quota-${prizeId}`;
};

export default {
  draw,
  refreshQuotas,
  redeem,
};

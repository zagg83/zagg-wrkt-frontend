import { rankColors } from './rankColors';

export function getExerciseRank(points) {
  if (points == null || points <= 0) {
    return {
      rank: 'BRONZE',
      color: rankColors.BRONZE.main,
      secondary: rankColors.BRONZE.secondary,
    };
  }

  if (points < 5) {
    return {
      rank: 'BRONZE',
      color: rankColors.BRONZE.main,
      secondary: rankColors.BRONZE.secondary,
    };
  }
  if (points < 10) {
    return {
      rank: 'SILVER',
      color: rankColors.SILVER.main,
      secondary: rankColors.SILVER.secondary,
    };
  }
  if (points < 15) {
    return {
      rank: 'GOLD',
      color: rankColors.GOLD.main,
      secondary: rankColors.GOLD.secondary,
    };
  }
  if (points < 22) {
    return {
      rank: 'DIAMOND',
      color: rankColors.DIAMOND.main,
      secondary: rankColors.DIAMOND.secondary,
    };
  }
  if (points < 30) {
    return {
      rank: 'MASTER',
      color: rankColors.MASTER.main,
      secondary: rankColors.MASTER.secondary,
    };
  }
  if (points < 40) {
    return {
      rank: 'GRANDMASTER',
      color: rankColors.GRANDMASTER.main,
      secondary: rankColors.GRANDMASTER.secondary,
    };
  }

  return {
    rank: 'LEGENDARY',
    color: rankColors.LEGENDARY.main,
    secondary: rankColors.LEGENDARY.secondary,
  };
}

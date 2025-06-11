import { getRankColors } from './rankColors';

function determineColor(user) {
  if (!user || !user.rank) return getRankColors('BRONZE');
  return getRankColors(user.rank);
}

export default determineColor;

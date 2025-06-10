function determineColor(user) {
  switch (user.rank) {
    case 'BRONZE':
      return '#cd7f32';
    case 'SILVER':
      return '#c0c0c0';
    case 'GOLD':
      return '#ffd700';
    case 'DIAMOND':
      return '#b9f2ff';
    case 'MASTER':
      return '#C70039';
    case 'GRANDMASTER':
      return '#4B0082';
    case 'LEGENDARY':
      return '#00CED1';
  }
}
export default determineColor;

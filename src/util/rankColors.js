export const rankColors = {
  BRONZE: {
    main: '#CD7F32',
    secondary: '#8B4513',
    gradient: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)',
  },
  SILVER: {
    main: '#C0C0C0',
    secondary: '#808080',
    gradient: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)',
  },
  GOLD: {
    main: '#FFD700',
    secondary: '#DAA520',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
  },

  DIAMOND: {
    main: '#00CED1',
    secondary: '#008B8B',
    gradient: 'linear-gradient(135deg, #00CED1 0%, #008B8B 100%)',
  },
  MASTER: {
    main: '#FF4500',
    secondary: '#8B0000',
    gradient: 'linear-gradient(135deg, #FF4500 0%, #8B0000 100%)',
  },
  GRANDMASTER: {
    main: '#FF1493',
    secondary: '#8B008B',
    gradient: 'linear-gradient(135deg, #FF1493 0%, #8B008B 100%)',
  },
  LEGENDARY: {
    main: '#9400D3',
    secondary: '#8B0000',
    gradient: 'linear-gradient(135deg, #9400D3 0%, #8B0000 100%)',
  },
};

export const getRankColors = rank => {
  const [rankName] = rank.split(' '); // Split "GOLD I" into ["GOLD", "I"]
  return rankColors[rankName] || rankColors.BRONZE; // Default to bronze if rank not found
};

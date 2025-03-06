
module.exports = {
    theme: {
      extend: {
        animation: {
          float: 'float 6s infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        },
      },
    },
    plugins: [],
  };
export const cloudAnimations = {
  topCloud: {
    animation: "moveTopCloud 20s forwards",
  },
  bottomCloud: {
    animation: "moveBottomCloud 26s forwards",
  },
};

export const animationKeyframes = `
    @keyframes moveTopCloud {
      0% { transform: translate(0, 0); }
      100% { transform: translate(30%, -30%); }
    }
    
    @keyframes moveBottomCloud {
      0% { transform: translate(0, 0); }
      100% { transform: translate(40%, -40%); }
    }
  `;

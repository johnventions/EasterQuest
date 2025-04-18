export const soundControls = (defaultState) => ({
    soundEnabled: defaultState,
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      return this.soundEnabled;
    },
  });
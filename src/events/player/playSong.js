const { createPlayerEmbed } = require('../../utils/playerEmbed');

module.exports = {
  name: 'playSong',
  /**
   * @param {import('distube').Queue} queue
   * @param {import('distube').Song} song
   */
  async execute(queue, song) {
    if (!queue.textChannel) return;

    try {
      // Disable components on old player message
      if (queue.metadata?.playerMessage) {
        try {
          await queue.metadata.playerMessage.edit({ components: [] });
        } catch (_) {}
      }

      const payload = createPlayerEmbed(queue, song, false);
      if (!payload) return;

      const playerMessage = await queue.textChannel.send(payload);
      queue.metadata = {
        ...(queue.metadata || {}),
        playerMessage: playerMessage,
      };
    } catch (error) {
      console.error('[PlaySong Event] Error sending player message:', error.message);
    }
  },
};

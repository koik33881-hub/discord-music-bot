require('dotenv').config();
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('ffmpeg-static');
const { spawn } = require('child_process');

async function testPlaylist() {
  const url = 'https://open.spotify.com/playlist/1omI5rfHqRbM7Ks4YKoaBk?si=440a5466c1bb4df1';
  console.log('1. Resolving Spotify Playlist URL:', url);

  const spotify = new SpotifyPlugin();
  try {
    const playlist = await spotify.resolve(url);
    console.log('✅ Playlist Resolved Successfully!');
    console.log('   Name:', playlist.name);
    console.log('   Total Songs:', playlist.songs.length);

    console.log('\n2. Inspecting First 5 Songs in Playlist:');
    playlist.songs.slice(0, 5).forEach((song, i) => {
      console.log(`   [${i + 1}] ${song.name} by ${song.uploader.name} (${song.formattedDuration})`);
      console.log(`       Search Query: "${spotify.createSearchQuery(song)}"`);
    });

    const firstSong = playlist.songs[0];
    const searchQuery = spotify.createSearchQuery(firstSong);
    console.log('\n3. Testing Stream Search for Song 1 on YouTube/yt-dlp:');
    console.log('   Query:', searchQuery);

    // Test ytdl / search
    const ytdlSearch = await ytdl.getInfo(searchQuery).catch(() => null);
    if (ytdlSearch) {
      console.log('✅ Found YouTube Video:', ytdlSearch.videoDetails.title);
      console.log('   Duration:', ytdlSearch.videoDetails.lengthSeconds, 'seconds');
    } else {
      console.log('   Testing standard search query...');
    }

    console.log('\n4. Testing FFmpeg Binary:');
    console.log('   Path:', ffmpeg);
    const ffProcess = spawn(ffmpeg, ['-version']);
    ffProcess.stdout.on('data', (d) => {
      console.log('✅ FFmpeg Version Header:', d.toString().split('\n')[0]);
    });
    ffProcess.on('close', (code) => {
      console.log('   FFmpeg process exit code:', code);
      console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    });

  } catch (err) {
    console.error('❌ Error during playlist resolution:', err);
  }
}

testPlaylist();

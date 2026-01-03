const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:8000';
const PODCASTS_FOLDER = path.join(__dirname, 'BEYOND THE DATING GAME-20251209T191233Z-1-001', 'BEYOND THE DATING GAME');
const IMAGES_FOLDER = path.join(__dirname, 'public', 'images', 'podcasts');

// You'll need to set this - get it from your login
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

// Map audio files to podcast metadata
const podcastMetadata = [
  {
    filename: 'Eps 01 Beyond The Dating Game.m4a',
    title: 'Episode 01: Beyond The Dating Game',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Introduction to moving beyond superficial dating and discovering how to build meaningful, lasting relationships.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null, // Will be calculated
    tags: 'relationships, dating, love, christian'
  },
  {
    filename: 'Esp 02 Study God to understand true love.m4a',
    title: 'Episode 02: Study God to Understand True Love',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Understanding true love through studying God\'s word and His design for relationships.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'relationships, love, god, biblical'
  },
  {
    filename: 'Eps 03 The mother of all relationships.m4a',
    title: 'Episode 03: The Mother of All Relationships',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Exploring the foundational relationship that shapes all others in our lives.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'relationships, foundation, family'
  },
  {
    filename: 'Eps 04 Love is not a game but a garden.m4a',
    title: 'Episode 04: Love is Not a Game But a Garden',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Understanding that love requires cultivation, care, and patience like a garden.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'love, relationships, growth, patience'
  },
  {
    filename: 'Eps 05 Who is teaching you about relationships.m4a',
    title: 'Episode 05: Who is Teaching You About Relationships?',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Examining the sources of our relationship knowledge and ensuring we learn from the right teachers.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'relationships, wisdom, learning, teaching'
  },
  {
    filename: 'Eps 06 Loneliness is not cured by a relationship.m4a',
    title: 'Episode 06: Loneliness is Not Cured by a Relationship',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Understanding that relationships cannot fill the void of loneliness - finding wholeness in Christ first.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'loneliness, relationships, healing, wholeness'
  },
  {
    filename: 'Eps 07 Falling in love is easy but staying....m4a',
    title: 'Episode 07: Falling in Love is Easy But Staying in Love',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'The difference between falling in love and staying in love - commitment and intentionality.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'love, commitment, relationships, staying power'
  },
  {
    filename: 'Eps 08 Defining A Godly relationship.m4a',
    title: 'Episode 08: Defining A Godly Relationship',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'What does a God-centered relationship look like? Biblical principles for godly relationships.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'godly, relationships, biblical, principles'
  },
  {
    filename: 'Eps 09 Who are you glorifying in your relationship.m4a',
    title: 'Episode 09: Who Are You Glorifying in Your Relationship?',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Ensuring our relationships bring glory to God and reflect His love to the world.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'glorifying god, relationships, purpose, mission'
  },
  {
    filename: 'Eps 11 Your partner should not stop you but help...m4a',
    title: 'Episode 11: Your Partner Should Not Stop You But Help You',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'A godly partner supports and encourages your growth, not hinders your purpose.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'partnership, support, growth, purpose'
  },
  {
    filename: 'Eps 12 Teenage Emotions and Mentality.m4a',
    title: 'Episode 12: Teenage Emotions and Mentality',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'teens',
    description: 'Understanding teenage emotions and developing healthy relationship mindsets during adolescence.',
    coverImage: 'wisdom for teenagers.jpeg',
    duration: null,
    tags: 'teens, emotions, relationships, youth'
  },
  {
    filename: 'Eps 13 Love is not a feeling.m4a',
    title: 'Episode 13: Love is Not a Feeling',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Understanding that love is a choice and commitment, not just an emotion.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'love, choice, commitment, feelings'
  },
  {
    filename: 'Eps 14 Trap vs treasure.m4a',
    title: 'Episode 14: Trap vs Treasure',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Learning to discern between relationships that trap you and those that are true treasures.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'discernment, relationships, wisdom, treasure'
  },
  {
    filename: 'Eps 15 Don_t just play learn in that relationship.m4a',
    title: 'Episode 15: Don\'t Just Play, Learn in That Relationship',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Every relationship is an opportunity to learn and grow, not just to have fun.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'learning, growth, relationships, wisdom'
  },
  {
    filename: 'Eps 16 Ignorance makes love loud but short lived.m4a',
    title: 'Episode 16: Ignorance Makes Love Loud But Short Lived',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Without wisdom and knowledge, relationships may start strong but quickly fade.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'ignorance, wisdom, relationships, knowledge'
  },
  {
    filename: 'Eps 17 Age does not qualify you for love.m4a',
    title: 'Episode 17: Age Does Not Qualify You for Love',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Maturity and readiness for love come from character, not just age.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'age, maturity, love, character'
  },
  {
    filename: 'Eps 18 Focus On Becoming The right partner.m4a',
    title: 'Episode 18: Focus On Becoming The Right Partner',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Instead of looking for the right person, focus on becoming the right person.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'self-improvement, becoming, relationships, growth'
  },
  {
    filename: 'Eps 19 Ignorance turns a blessing to be a burden.m4a',
    title: 'Episode 19: Ignorance Turns a Blessing to Be a Burden',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'How lack of knowledge can turn God\'s blessings into burdens in relationships.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'ignorance, blessings, relationships, wisdom'
  },
  {
    filename: 'Eps 20 Quality preparation.m4a',
    title: 'Episode 20: Quality Preparation',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'The importance of preparing yourself for a quality relationship.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'preparation, quality, relationships, readiness'
  },
  {
    filename: 'Eps 21 Never confuse lust for love.m4a',
    title: 'Episode 21: Never Confuse Lust for Love',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'Understanding the critical difference between lust and genuine love.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'lust, love, relationships, discernment'
  },
  {
    filename: 'Eps 22 Heal before the relationship.m4a',
    title: 'Episode 22: Heal Before The Relationship',
    host: 'FOG Relationship Team',
    type: 'episode',
    category: 'beyond-dating-game',
    description: 'The importance of healing from past hurts before entering new relationships.',
    coverImage: 'Beyond the dating Game.jpeg',
    duration: null,
    tags: 'healing, relationships, wholeness, preparation'
  }
];

async function uploadAudioFile(filePath, token) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  const response = await fetch(`${API_BASE_URL}/api/podcasts/upload-audio`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Failed to upload audio: ${response.status}`);
  }

  return await response.json();
}

async function uploadCoverImage(imagePath, token) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(imagePath));

  const response = await fetch(`${API_BASE_URL}/api/podcasts/upload-cover`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Failed to upload cover: ${response.status}`);
  }

  return await response.json();
}

async function createPodcast(podcastData, token) {
  const response = await fetch(`${API_BASE_URL}/api/podcasts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(podcastData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Failed to create podcast: ${response.status}`);
  }

  return await response.json();
}

async function main() {
  if (!AUTH_TOKEN) {
    console.error(' Error: AUTH_TOKEN is required!');
    console.log('Please set it as an environment variable:');
    console.log('export AUTH_TOKEN="your_token_here"');
    console.log('Or pass it when running: AUTH_TOKEN=your_token node upload_podcasts.js');
    process.exit(1);
  }

  console.log(' Starting podcast upload process...\n');

  for (let i = 0; i < podcastMetadata.length; i++) {
    const metadata = podcastMetadata[i];
    const audioPath = path.join(PODCASTS_FOLDER, metadata.filename);
    const coverPath = path.join(IMAGES_FOLDER, metadata.coverImage);

    console.log(`\n[${i + 1}/${podcastMetadata.length}] Processing: ${metadata.title}`);

    try {
      // Check if files exist
      if (!fs.existsSync(audioPath)) {
        console.log(` Skipping: Audio file not found: ${metadata.filename}`);
        continue;
      }

      if (!fs.existsSync(coverPath)) {
        console.log(`Skipping: Cover image not found: ${metadata.coverImage}`);
        continue;
      }

      // Upload audio file
      console.log(' Uploading audio file...');
      const audioResult = await uploadAudioFile(audioPath, AUTH_TOKEN);
      console.log(` Audio uploaded: ${audioResult.url}`);

      // Upload cover image
      console.log('Uploading cover image...');
      const coverResult = await uploadCoverImage(coverPath, AUTH_TOKEN);
      console.log(`Cover uploaded: ${coverResult.url}`);

      // Create podcast entry
      console.log('Creating podcast entry...');
      const podcastData = {
        title: metadata.title,
        host: metadata.host,
        type: metadata.type,
        category: metadata.category,
        description: metadata.description,
        duration: metadata.duration,
        is_live: false,
        is_free: true,
        tags: metadata.tags,
        audio_url: audioResult.url,
        transcript: null,
        cover: coverResult.url
      };

      const podcast = await createPodcast(podcastData, AUTH_TOKEN);
      console.log(`Podcast created with ID: ${podcast.id}`);

    } catch (error) {
      console.error(`Error processing ${metadata.title}:`, error.message);
    }
  }

  console.log('\nUpload process completed!');
}

main().catch(console.error);


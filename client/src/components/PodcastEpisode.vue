<template>
  <el-row class="episode">
    <el-col :span="2" class="episode-play">
      <div @click="playEpisode(episode, episode.podcast_title)">
        <img src="../assets/icons/playback/play_circle.svg" alt="Play episode button" />
      </div>
    </el-col>
    <el-col :span="7">
      <b :title="episode.title">{{episode.title}}</b>
    </el-col>
    <el-col :span="13" class="description" :id="id">
      <div @click="showHideDescription(episode.id)">
        <p>{{removeHTMLTags(episode.description)}}</p>
      </div>
    </el-col>
    <el-col :span="2" class="episode-time">{{formatTime(episode.audio_length)}}</el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.episode {
  padding: 0.5rem 0 0.5rem 0;
  border-bottom: 1px solid #ebebeb;
  &:last-child {
    border-bottom: none;
  }
  transition: width 2s, height 2s ease 2s;
  -webkit-animation: fadein 0.1s; /* Safari and Chrome */
  .episode-play {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 2rem;
    }
    cursor: pointer;
  }
  .episode-time {
    text-align: center;
  }
  .description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    cursor: pointer;
    p {
      margin: unset;
    }
  }
  .description-show {
    -webkit-line-clamp: unset;
    height: 140px;
    overflow-y: scroll;
  }
}

@keyframes fadein {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}
</style>

<script>
import globalMixin from '../sevices/_helper';

export default {
  props: [
    'id',
    'title',
    'image',
    'description',
    'audio',
    'audioLength',
    'podcastTitle',
  ],
  mixins: [globalMixin],
  data() {
    return {
      episode: {},
    };
  },
  methods: {
    showHideDescription(episodeId) {
      console.log(episodeId);

      document.getElementById(episodeId).classList.toggle('description-show');
    },
  },
  created() {
    this.episode = {
      id: this.id,
      title: this.title,
      image: this.image,
      description: this.description,
      audio: this.audio,
      audio_length: this.audioLength,
      podcast_title: this.podcastTitle,
    };
    console.log(this.episode);
  },
};
</script>

<template>
  <div class="episode row">
    <div class="col-md-2 episode-play" @click="_playEpisode(episode, episode.podcast_title)">
      <i class="icon icon-play-circle"></i>
    </div>
    <div class="col-md-7">
      <b :title="episode.title">{{episode.title}}</b>
    </div>
    <div class="col-md-13 description" :id="id" @click="showHideDescription(episode.id)">
      <p>{{_removeHTMLTags(episode.description)}}</p>
    </div>
    <div class="col-md-2 episode-time">{{_formatTime(episode.audio_length)}}</div>
  </div>
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
    text-align: center;
    font-size: 2em;
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
import { globalMixin } from '../sevices/_helper';

export default {
  props: [
    'id',
    'title',
    'image',
    'description',
    'audio',
    'audioLength',
    'podcastTitle'
  ],
  mixins: [globalMixin],
  data () {
    return {
      episode: {}
    };
  },
  methods: {
    showHideDescription (episodeId) {
      document.getElementById(episodeId).classList.toggle('description-show');
    }
  },
  created () {
    this.episode = {
      id: this.id,
      title: this.title,
      image: this.image,
      description: this.description,
      audio: this.audio,
      audio_length: this.audioLength,
      podcast_title: this.podcastTitle
    };
    console.log(this.episode);
  }
};
</script>

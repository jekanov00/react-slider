import React, { Component } from 'react';
import './styles.css';

class Slider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      height: window.innerHeight - 200 + 'px',
      images: null,
      currentImg: 1,
      isPlaying: false,
      isFullscreen: false,
      intervalID: null,
      intervalGap: 3,
    };
  }

  isImagesLoaded() {
    const { isLoaded, images, currentImg } = this.state;
    if (isLoaded) {
      if (images[currentImg].height > images[currentImg].width) {
        return <img src={images[currentImg].url} alt={images[currentImg].name} className={'image'} style={{ height: 100 + '%' }} />;
      } else {
        return <img src={images[currentImg].url} alt={images[currentImg].name} className={'image'} style={{ width: 100 + '%' }} />;
      }
    } else {
      return (
        <svg className={'spinner'} viewBox={'0 0 50 50'}>
          <circle className={'path'} cx={'25'} cy={'25'} r={'20'} fill={'none'} strokeWidth={5}></circle>
        </svg>
      );
    }
  }

  prevImgHandler() {
    const { currentImg, images } = this.state;
    let prevImg = currentImg - 1;
    if (currentImg - 1 < 1) {
      prevImg = Object.keys(images).length;
    }

    this.setState({
      currentImg: prevImg,
    });
  }

  nextImgHandler() {
    const { currentImg, images } = this.state;
    let nextImg = currentImg + 1;
    if (currentImg + 1 > Object.keys(images).length) {
      nextImg = 1;
    }

    this.setState({
      currentImg: nextImg,
    });
  }

  playHandler() {
    const { isPlaying } = this.state;
    let reverseIsPlaying = !isPlaying;
    this.setState({
      isPlaying: reverseIsPlaying,
    });

    this.playInterval(reverseIsPlaying, this.state.intervalGap);
  }

  intervalGapHandler() {
    const { intervalGap, isPlaying, intervalID } = this.state;
    let intervalGapTemp = intervalGap;
    if (intervalGap === 10) {
      intervalGapTemp = 1;
      this.setState({
        intervalGap: 1,
      });
    } else if (intervalGap === 5) {
      intervalGapTemp = 10;
      this.setState({
        intervalGap: 10,
      });
    } else {
      intervalGapTemp = intervalGap + 2;
      this.setState({
        intervalGap: intervalGapTemp,
      });
    }
    window.clearInterval(intervalID);
    this.playInterval(isPlaying, intervalGapTemp);
  }

  fullscreenHandler() {
    const { isFullscreen } = this.state;
    let slider = document.getElementsByClassName('slider')[0];

    if (isFullscreen) {
      slider.style.cssText = `height: ${window.innerHeight - 200}px`;
      this.setState({
        isFullscreen: !isFullscreen,
      });
    } else {
      slider.style.cssText = `width: ${window.innerWidth}px; height: ${window.innerHeight}px; z-index:9999; position:fixed; left:0; top:0; margin:0; border: none;`;
      this.setState({
        isFullscreen: !isFullscreen,
      });
    }
  }

  isSliderPlaying() {
    const { isPlaying } = this.state;

    if (isPlaying) {
      return <path d={'M14,19H18V5H14M6,19H10V5H6V19Z'} />;
    } else {
      return <path d={'M8,5.14V19.14L19,12.14L8,5.14Z'} />;
    }
  }

  playInterval(isPlaying, intervalGapTemp) {
    const { intervalID } = this.state;

    if (isPlaying) {
      let intervalIDTemp = window.setInterval(() => {
        this.nextImgHandler();
      }, intervalGapTemp * 1000);
      this.setState({
        intervalID: intervalIDTemp,
      });
    } else {
      window.clearInterval(intervalID);
    }
  }

  componentDidMount() {
    fetch('data/images.json')
      .then(res => res.json())
      .then(data => {
        this.setState({
          isLoaded: true,
          images: data,
        });
      })
      .catch(e => console.error(e));
  }

  render() {
    const { height } = this.state;

    window.addEventListener('resize', () => {
      this.setState({
        height: window.innerHeight - 200 + 'px',
      });
    });

    return (
      <article className={'slider'} style={{ height: height }}>
        <svg
          className={'left'}
          viewBox={'0 0 24 24'}
          onClick={() => {
            this.prevImgHandler();
          }}
        >
          <path d={'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z'} />
        </svg>
        {this.isImagesLoaded()}
        <svg
          className={'right'}
          viewBox={'0 0 24 24'}
          onClick={() => {
            this.nextImgHandler();
          }}
        >
          <path d={'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z'} />
        </svg>
        <svg
          className={'play'}
          viewBox={'0 0 24 24'}
          onClick={() => {
            this.playHandler();
          }}
        >
          {this.isSliderPlaying()}
        </svg>
        <span
          className={'intervalGap'}
          onClick={() => {
            this.intervalGapHandler();
          }}
        >
          {this.state.intervalGap + 's'}
        </span>
        <svg
          className={'fullscreen'}
          viewBox={'0 0 24 24'}
          onClick={() => {
            this.fullscreenHandler();
          }}
        >
          <path d={'M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z'} />
        </svg>
      </article>
    );
  }
}

export default Slider;

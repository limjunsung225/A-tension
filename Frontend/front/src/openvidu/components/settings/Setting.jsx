import React, { useState, useEffect } from 'react';
import { getVideos, getAudios, getSpeakers } from '../utils/customUseDevice';
import './Setting.css';

const Setting = (props) => {
  const {
    display,
    toggleSetting,
    header,
    setVideo,
    setAudio,
    setSpeaker,
    setMyVideos,
    videos,
    setMyAudios,
    audios,
    setMySpeakers,
    speakers,
    currentVideoDeviceId,
    currentAudioDeviceId,
    currentSpeakerDeviceId,
  } = props;

  const changeVideo = (e) => {
    setVideo(e.target.value, videos);
  };

  const changeAudio = (e) => {
    setAudio(e.target.value, audios);
  };

  const changeSpeaker = (e) => {
    setSpeaker(e.target.value);
  };

  useEffect(() => {
    const getMyDevices = async () => {
      const newVideos = await getVideos();
      const newAudios = await getAudios();
      const newSpeakers = await getSpeakers();
      setMyVideos(newVideos);
      setMyAudios(newAudios);
      setMySpeakers(newSpeakers);
    };
    if (display) getMyDevices();
  }, [display]);

  return (
    <div className={display ? 'openModal modal' : 'modal'}>
      {display ? (
        <section>
          <header>
            {header}
            <button className="close" onClick={toggleSetting}>
              &times;
            </button>
          </header>
          <main>
            <div className="settingSection">
              <div className="settingVideo">
                <p>비디오 : </p>
                <select onChange={changeVideo}>
                  {videos.map((video, i) =>
                    video.deviceId === currentVideoDeviceId ? (
                      <option value={video.deviceId} selected>
                        {video.label}
                      </option>
                    ) : (
                      <option value={video.deviceId}>{video.label}</option>
                    ),
                  )}
                </select>
              </div>
              <div className="settingAudio">
                <p>마이크 : </p>
                <select onChange={changeAudio}>
                  {audios.map((audio, i) =>
                    audio.deviceId === currentAudioDeviceId ? (
                      <option value={audio.deviceId} selected>
                        {audio.label}
                      </option>
                    ) : (
                      <option value={audio.deviceId}>{audio.label}</option>
                    ),
                  )}
                </select>
              </div>
              <div className="settingSpeaker">
                <p>오디오 : </p>
                <select onChange={changeSpeaker}>
                  {speakers.map((speaker, i) =>
                    speaker.deviceId === currentSpeakerDeviceId ? (
                      <option value={speaker.deviceId} selected>
                        {speaker.label}
                      </option>
                    ) : (
                      <option value={speaker.deviceId}>{speaker.label}</option>
                    ),
                  )}
                </select>
              </div>
            </div>
          </main>
        </section>
      ) : null}
    </div>
  );
};

export default Setting;

import React, { useRef, useEffect } from 'react';
import './StreamComponent.css';
import useUpdateSpeaker from '../utils/useUpdateSpeaker';

// OvVideoComponent: 비디오 컴포넌트 관련 함수
const OvVideoComponent = (props) => {
  const { user, mutedSound, currentSpeakerDeviceId } = props;
  const videoRef = useRef();
  useUpdateSpeaker(videoRef, currentSpeakerDeviceId);

  // componentDidMount: 해당 컴포넌트가 마운트되고 나서 user의 getStreamManager에 비디오 요소를 넣는 리액트 컴포넌트 생명주기함수
  useEffect(() => {
    if (props && user.streamManager && !!videoRef) {
      user.getStreamManager().addVideoElement(videoRef.current);
    }

    if (props && user.streamManager.session && user && !!videoRef) {
      user.streamManager.session.on('signal:userChanged', (event) => {
        const data = JSON.parse(event.data);
        if (data.isScreenShareActive !== undefined) {
          user.getStreamManager().addVideoElement(videoRef.current);
        }
      });
    }
  }, []);

  // componentDidUpdate: 컴포넌트가 업데이트 된 이후에 user의 getStreamManager에 비디오 요소를 넣는 리액트 컴포넌트 생명주기함수
  useEffect(() => {
    if (props && !!videoRef) {
      user.getStreamManager().addVideoElement(videoRef.current);
    }
  }, [user, mutedSound, currentSpeakerDeviceId, props]);

  // render: 렌더링을 도와주는 함수
  return (
    <video
      autoPlay={true}
      id={'video-' + user.getStreamManager().stream.streamId}
      ref={videoRef}
      muted={mutedSound}
    />
  );
};

export default OvVideoComponent;

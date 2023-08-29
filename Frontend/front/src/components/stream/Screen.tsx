import { useEffect } from 'react';
interface Props{
    video:boolean;
     audio:boolean;
}
export const Screen = (props:Props) => {

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: props.audio,
          video: props.video,
        });

        const video = document.querySelector('video'); // Get the video element by id
        if (video) {
          video.srcObject = mediaStream;
          video.onloadedmetadata = () => {
            video.play();
          };
        }
      } catch (err) {
        console.log('Error accessing media devices:', err);
      }
    };

    getMediaStream();
  }, [props.video,props.audio]);

  return (
    <>
      <video  autoPlay playsInline />
    </>
  );
};

export default Screen;
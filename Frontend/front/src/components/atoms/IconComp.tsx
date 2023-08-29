// import ActivityIcon from '../assets/icons/group.svg';
interface Props{
    Icon:string;
}
const IconComp = (props:Props) => {
  return (
    <>
  
    <div className="round w-6 h-6 left-0 top-0 absolute bg-white rounded-full">
    <div id={props.Icon} className="w-4 h-4 left-[4px] top-[4px] absolute origin-top-left">
      <img src={props.Icon} alt={props.Icon} />
    </div>
    </div>  </>
  );
};

export default IconComp;

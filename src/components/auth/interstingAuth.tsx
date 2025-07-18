import InterestingList from "../core/InterstingList";

const InterestingAuth = ({setSlideAvailable, setSlideUnAvailable, showError, user}) => {

  const onChangeValue = (value) => {
    if(value.size !== 0 ){
      setSlideAvailable("interests", Array.from(new Set(value)))
      showError(false)
    }else{
      setSlideUnAvailable("interests", new Set([]))
      showError(false)
    }
  }
  
  return (
    <div className="flex justify-between flex-col px-6  pb-4">
      <form className="flex w-full flex-col gap-4">
        <InterestingList user={user} onChangeValue={onChangeValue}/>
      </form>
    </div>
  );
};

export default InterestingAuth;


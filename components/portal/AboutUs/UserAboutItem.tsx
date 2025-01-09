const UserAboutItem = ({ imgUrl, name, major }) => {
  return (
    <div className="mt-6 px-2">
      <div className="flex w-full flex-col rounded-lg bg-white">
        <div className="h-[290px] p-[10px]">
          <img src={imgUrl} alt={name} className="h-full w-full rounded-md" />
        </div>
        <div className="px-4 pb-4 pt-2">
          <h4 className="text-[17px] font-semibold text-[#05264e]">{name}</h4>
          <span className="text-sm text-[#1ca774]">{major}</span>
        </div>
      </div>
    </div>
  );
};
export default UserAboutItem;

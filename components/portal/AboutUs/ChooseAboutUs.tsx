const ChooseAboutUs = ({ number, title, desc }) => {
  return (
    <div className="mt-6 px-3">
      <div className="rounded-lg bg-[#1b4853] px-10  py-7">
        <div className="mb-4">
          <h2 className="mb-2 text-5xl font-semibold text-[#7bbd15]">{number}.</h2>
        </div>
        <h5 className="mb-2 text-[20px] font-semibold text-[#f8f9fa]">{title}</h5>
        <p className="left-[25.2px] mb-[10px] text-sm text-[#f8f9fa] opacity-75">{desc}</p>
      </div>
    </div>
  );
};
export default ChooseAboutUs;

<div className="grid grid-cols-1 gap-[30px] ">
  {paginatedWorkshops.map(workshop => (
    <div
      key={workshop.id}
      className="rts__single__blog mp_transition_4 group relative flex h-full w-full flex-row  gap-[20px] overflow-hidden rounded-[10px] border-[1px] border-primary-border bg-primary-white px-[24px] py-[30px] pt-[24px] hover:border-transparent hover:bg-transparent">
      <div className="mp_transition_4 absolute inset-0 z-[-1] bg-transparent opacity-0 group-hover:bg-custom-gradient-1 group-hover:opacity-100"></div>
      <Link href={`/workshops/${workshop.id}`} className="blog__img">
        <img
          src={workshop.imageWorkshops || '/images/default-workshop.png'}
          className="vertical-center min-h-[240px] max-w-[360px] max-w-full overflow-hidden rounded-[10px] object-cover"
          alt={workshop.workshopTitle}
        />
      </Link>
      <div className="flex w-full flex-col">
        <Link href={`/workshops/${workshop.id}`} className="block truncate whitespace-nowrap text-[24px] font-semibold text-primary-black ">
          {workshop.workshopTitle}
        </Link>
        <div className="blog__meta pt-[16px]">
          <div className="blog__meta__info mb-[16px] flex items-center gap-4 text-primary-gray">
            <span className="flex items-center gap-1 ">
              <i className="fa-solid fa-calendar"></i>
              <span className="truncate whitespace-nowrap">{formatDateDD_thang_MM_yyyy(workshop.startTime)}</span>
            </span>
            <span className="flex items-center gap-1 truncate">
              <i className="fa-solid fa-user"></i>
              <span className="truncate whitespace-nowrap">{workshop.university.universityName}</span>
            </span>
          </div>
          <div className="readmore__btn flex items-center gap-1 truncate text-primary-gray">
            <i className="fa-solid fa-location-dot mp_transition_4" />
            <span className="mp_transition_4 truncate whitespace-nowrap font-medium">
              {workshop.address.province.provinceName}, {workshop.address.district.districtName}
            </span>
          </div>
        </div>
        <p className="mt-[16px] line-clamp-2 text-lg text-primary-gray">{workshop.workshopDescription}</p>
        <div className="absolute bottom-[30px] right-[24px] flex items-center justify-end ">
          <Link href={`/workshops/${workshop.id}`} className="readmore__btn mf-2 mr-2 flex items-center gap-2 text-lg">
            <span className="mp_transition_4 font-medium hover:text-primary-main">Chi tiết</span>
            <i className="fa-solid fa-arrow-right mp_transition_4 rotate-[-40deg] group-hover:rotate-0 group-hover:text-primary-main" />
          </Link>
        </div>
      </div>
    </div>
  ))}
</div>;

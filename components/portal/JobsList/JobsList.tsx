import React from 'react';

const JobsList = () => {
  return (
    <div className="rts__section mp_section_padding">
      <div className="container mx-auto">
        <div className="flex items-start gap-[30px]">
          <div className="job__search__section mb-[40px] rounded-[10px] bg-custom-gradient-1 p-[30px]">
            <form className="flex flex-col gap-[30px]">
              <div className="search__item">
                <label htmlFor="search" className="font-20 fw-medium text-dark text-capitalize mb-3">
                  Search By Job Title
                </label>
                <div className="position-relative">
                  <input type="text" id="search" placeholder="Enter Type Of job" required="" />
                  <i className="fa-light fa-magnifying-glass" />
                </div>
              </div>
              {/* job location */}
              <div className="search__item">
                <h6 className="font-20 fw-medium text-dark text-capitalize mb-3">Search Location</h6>
                <div className="position-relative">
                  <div className="nice-select" tabIndex={0}>
                    <span className="current">Search Location</span>
                    <ul className="list">
                      <li data-value="Nothing" data-display="Search Location" className="option selected focus">
                        Search Location
                      </li>
                      <li data-value={1} className="option">
                        Dhaka
                      </li>
                      <li data-value={2} className="option">
                        Barisal
                      </li>
                      <li data-value={3} className="option">
                        Chittagong
                      </li>
                      <li data-value={4} className="option">
                        Rajshahi
                      </li>
                    </ul>
                  </div>
                  <i className="fa-light fa-location-dot" />
                </div>
              </div>
              {/* job category */}
              <div className="search__item">
                <h6 className="font-20 fw-medium text-dark text-capitalize mb-3">Search By Job category</h6>
                <div className="position-relative">
                  <div className="nice-select" tabIndex={0}>
                    <span className="current">Choose a Category</span>
                    <ul className="list">
                      <li data-value="Nothing" data-display="Search By Job category" className="option selected focus">
                        Choose a Category
                      </li>
                      <li data-value={1} className="option">
                        Government
                      </li>
                      <li data-value={2} className="option">
                        NGO
                      </li>
                      <li data-value={3} className="option ">
                        Private
                      </li>
                    </ul>
                  </div>
                  <i className="rt-briefcase" />
                </div>
              </div>
              {/* job post time */}
              <div className="search__item">
                <h6 className="font-20 fw-medium text-dark text-capitalize mb-3">Date posted</h6>
                <div className="position-relative">
                  <div className="nice-select" tabIndex={0}>
                    <span className="current">Date Posted</span>
                    <ul className="list">
                      <li data-value="Nothing" data-display="Date posted" className="option selected focus">
                        Date Posted
                      </li>
                      <li data-value={1} className="option">
                        01 Jan 24
                      </li>
                      <li data-value={2} className="option">
                        05 Feb 24
                      </li>
                      <li data-value={3} className="option">
                        07 Mar 24
                      </li>
                    </ul>
                  </div>
                  <i className="fa-light fa-clock" />
                </div>
              </div>
              {/* job post time */}
              <div className="search__item">
                <div className="font-20 fw-medium text-dark text-capitalize mb-3">job type</div>
                <div className="search__item__list">
                  <div className="d-flex align-items-center justify-content-between list">
                    <div className="d-flex align-items-center checkbox gap-2">
                      <input type="checkbox" name="fulltime" id="fulltime" />
                      <label htmlFor="fulltime">Full Time</label>
                    </div>
                    <span>(130)</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between list">
                    <div className="d-flex align-items-center checkbox gap-2">
                      <input type="checkbox" name="part" id="part" />
                      <label htmlFor="part">Part Time</label>
                    </div>
                    <span>(80)</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between list">
                    <div className="d-flex align-items-center checkbox gap-2">
                      <input type="checkbox" name="temporary" id="temporary" />
                      <label htmlFor="temporary">temporary</label>
                    </div>
                    <span>(150)</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between list">
                    <div className="d-flex align-items-center checkbox gap-2">
                      <input type="checkbox" name="freelance" id="freelance" />
                      <label htmlFor="freelance">freelance</label>
                    </div>
                    <span>(130)</span>
                  </div>
                </div>
              </div>
              {/* experience label */}
              <div className="search__item">
                <div className="font-20 fw-medium text-dark text-capitalize mb-3">experience Label</div>
                <div className="search__item__list">
                  <div className="d-flex align-items-center justify-content-between list">
                    <div className="d-flex align-items-center checkbox gap-2">
                      <input type="checkbox" name="5year" id="5year" />
                      <label htmlFor="5year">5 year</label>
                    </div>
                    <span>(10)</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between list">
                    <div className="d-flex align-items-center checkbox gap-2">
                      <input type="checkbox" name="4year" id="4year" />
                      <label htmlFor="4year">4 year</label>
                    </div>
                    <span>(15)</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between list">
                    <div className="d-flex align-items-center checkbox gap-2">
                      <input type="checkbox" name="3year" id="3year" />
                      <label htmlFor="3year">3 year</label>
                    </div>
                    <span>(50)</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between list">
                    <div className="d-flex align-items-center checkbox gap-2">
                      <input type="checkbox" name="fresher" id="fresher" />
                      <label htmlFor="fresher">fresher</label>
                    </div>
                    <span>(130)</span>
                  </div>
                </div>
              </div>
              {/* salary label */}
              <div className="search__item">
                <div className="font-20 fw-medium text-dark text-capitalize mb-3">salary offered</div>
                <div className="search__item__list">
                  <div className="d-flex align-items-center justify-content-between list">
                    <div className="d-flex align-items-center checkbox gap-2">
                      <input type="checkbox" name={500} id={500} />
                      <label htmlFor={500}>under $500</label>
                    </div>
                    <span>(10)</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between list">
                    <div className="d-flex align-items-center checkbox gap-2">
                      <input type="checkbox" name={5000} id={5000} />
                      <label htmlFor={5000}>$5,000 - $10,000</label>
                    </div>
                    <span>(44)</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between list">
                    <div className="d-flex align-items-center checkbox gap-2">
                      <input type="checkbox" name={1000} id={1000} />
                      <label htmlFor={1000}>$10,000 - $15,000</label>
                    </div>
                    <span>(27)</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between list">
                    <div className="d-flex align-items-center checkbox gap-2">
                      <input type="checkbox" name={1500} id={1500} />
                      <label htmlFor={1500}>$15,000 - $20,000</label>
                    </div>
                    <span>(85)</span>
                  </div>
                </div>
              </div>
              <button type="submit" className="rts__btn no__fill__btn max-content job__search__btn font-sm mx-auto" aria-label="Search">
                Find Job
              </button>
            </form>
          </div>
          <div className="col-lg-7 col-xl-8">
            <div className="top__query d-flex gap-xl-0 justify-content-between align-items-center mb-40 flex-wrap gap-4">
              <span className="text-dark font-20 fw-medium">Showing 1-9 of 19 results</span>
              <div className="d-flex align-items-center flex-wrap gap-4">
                <form action="#" className="category-select">
                  <div className="position-relative">
                    <div className="nice-select" tabIndex={0}>
                      <span className="current">All Category</span>
                      <ul className="list">
                        <li data-value="Nothing" data-display="All Category" className="option selected focus">
                          All Category
                        </li>
                        <li data-value={1} className="option">
                          Part Time
                        </li>
                        <li data-value={2} className="option">
                          Full Time
                        </li>
                        <li data-value={3} className="option">
                          Government
                        </li>
                        <li data-value={4} className="option">
                          NGO
                        </li>
                        <li data-value={5} className="option">
                          Private
                        </li>
                      </ul>
                    </div>
                  </div>
                </form>
                <div className="d-flex align-items-center gap-3" id="nav-tab" role="tablist">
                  <button
                    className="rts__btn no__fill__btn grid-style nav-link active"
                    data-bs-toggle="tab"
                    data-bs-target="#grid"
                    aria-selected="true"
                    role="tab">
                    {' '}
                    <i className="rt-hamburger" /> Grid
                  </button>
                  <button
                    className="rts__btn no__fill__btn list-style nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#list"
                    aria-selected="false"
                    tabIndex={-1}
                    role="tab">
                    {' '}
                    <i className="rt-list" /> List
                  </button>
                </div>
              </div>
            </div>
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane grid__style fade show active" role="tabpanel" id="grid">
                <div className="row g-30">
                  <div className="col-xl-6 col-md-6 col-lg-12">
                    <div className="rts__job__card">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="company__icon">
                          <img src="assets/img/home-1/company/google.svg" alt="" />
                        </div>
                        <div className="featured__option"></div>
                      </div>
                      <div className="d-flex mt-4 flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-location-dot" /> Newyork, USA
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-briefcase" /> Full Time
                        </div>
                      </div>
                      <div className="h6 job__title my-3">
                        <a href="#" aria-label="job">
                          Senior UX Designer, Google
                        </a>
                      </div>
                      <p>Consectetur adipisicing elit. Possimus aut mollitia eum ipsum fugiat odio officiis odit mollitia eum ipsum.</p>
                      <div className="job__tags d-flex mt-4 flex-wrap gap-2">
                        <a href="#">Creative</a>
                        <a href="#">user interface</a>
                        <a href="#">web ui</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-md-6 col-lg-12">
                    <div className="rts__job__card">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="company__icon">
                          <img src="assets/img/home-1/company/microsoft.svg" alt="" />
                        </div>
                        <div className="featured__option"></div>
                      </div>
                      <div className="d-flex mt-4 flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-location-dot" /> Newyork, USA
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-briefcase" /> Full Time
                        </div>
                      </div>
                      <div className="h6 job__title my-3">
                        <a href="#" aria-label="job">
                          Software Engineer, Bing
                        </a>
                      </div>
                      <p>Consectetur adipisicing elit. Possimus aut mollitia eum ipsum fugiat odio officiis odit mollitia eum ipsum.</p>
                      <div className="job__tags d-flex mt-4 flex-wrap gap-2">
                        <a href="#">React</a>
                        <a href="#">javascript</a>
                        <a href="#">web ui</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-md-6 col-lg-12">
                    <div className="rts__job__card">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="company__icon">
                          <img src="assets/img/home-1/company/apple.svg" alt="" />
                        </div>
                        <div className="featured__option"></div>
                      </div>
                      <div className="d-flex mt-4 flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-location-dot" /> Newyork, USA
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-briefcase" /> Full Time
                        </div>
                      </div>
                      <div className="h6 job__title my-3">
                        <a href="#" aria-label="job">
                          Senior UX Designer, Apple
                        </a>
                      </div>
                      <p>Consectetur adipisicing elit. Possimus aut mollitia eum ipsum fugiat odio officiis odit mollitia eum ipsum.</p>
                      <div className="job__tags d-flex mt-4 flex-wrap gap-2">
                        <a href="#">Creative</a>
                        <a href="#">user interface</a>
                        <a href="#">web ui</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-md-6 col-lg-12">
                    <div className="rts__job__card">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="company__icon">
                          <img src="assets/img/home-1/company/upwork.svg" alt="" />
                        </div>
                        <div className="featured__option"></div>
                      </div>
                      <div className="d-flex mt-4 flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-location-dot" /> Newyork, USA
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-briefcase" /> Full Time
                        </div>
                      </div>
                      <div className="h6 job__title my-3">
                        <a href="#" aria-label="job">
                          Web Developer, Upwork
                        </a>
                      </div>
                      <p>Consectetur adipisicing elit. Possimus aut mollitia eum ipsum fugiat odio officiis odit mollitia eum ipsum.</p>
                      <div className="job__tags d-flex mt-4 flex-wrap gap-2">
                        <a href="#">HTML</a>
                        <a href="#">CSS</a>
                        <a href="#">SCSS</a>
                        <a href="#">Figma</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-md-6 col-lg-12">
                    <div className="rts__job__card">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="company__icon">
                          <img src="assets/img/home-1/company/facebook.svg" alt="" />
                        </div>
                        <div className="featured__option"></div>
                      </div>
                      <div className="d-flex mt-4 flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-location-dot" /> Newyork, USA
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-briefcase" /> Full Time
                        </div>
                      </div>
                      <div className="h6 job__title my-3">
                        <a href="#" aria-label="job">
                          Digital Marketing, Facebook
                        </a>
                      </div>
                      <p>Consectetur adipisicing elit. Possimus aut mollitia eum ipsum fugiat odio officiis odit mollitia eum ipsum.</p>
                      <div className="job__tags d-flex mt-4 flex-wrap gap-2">
                        <a href="#">Blog Post</a>
                        <a href="#">web ui</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-md-6 col-lg-12">
                    <div className="rts__job__card">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="company__icon">
                          <img src="assets/img/home-1/company/in.svg" alt="" />
                        </div>
                        <div className="featured__option"></div>
                      </div>
                      <div className="d-flex mt-4 flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-location-dot" /> Newyork, USA
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-briefcase" /> Full Time
                        </div>
                      </div>
                      <div className="h6 job__title my-3">
                        <a href="#" aria-label="job">
                          Graphic Designer, Linkedin
                        </a>
                      </div>
                      <p>Consectetur adipisicing elit. Possimus aut mollitia eum ipsum fugiat odio officiis odit mollitia eum ipsum.</p>
                      <div className="job__tags d-flex mt-4 flex-wrap gap-2">
                        <a href="#">Creative</a>
                        <a href="#">user interface</a>
                        <a href="#">web ui</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-md-6 col-lg-12">
                    <div className="rts__job__card">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="company__icon">
                          <img src="assets/img/home-1/company/udemy.svg" alt="" />
                        </div>
                        <div className="featured__option"></div>
                      </div>
                      <div className="d-flex mt-4 flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-location-dot" /> Newyork, USA
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-briefcase" /> Full Time
                        </div>
                      </div>
                      <div className="h6 job__title my-3">
                        <a href="#" aria-label="job">
                          Online Trainer, Udemy
                        </a>
                      </div>
                      <p>Consectetur adipisicing elit. Possimus aut mollitia eum ipsum fugiat odio officiis odit mollitia eum ipsum.</p>
                      <div className="job__tags d-flex mt-4 flex-wrap gap-2">
                        <a href="#">Creative</a>
                        <a href="#">user interface</a>
                        <a href="#">web ui</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-md-6 col-lg-12">
                    <div className="rts__job__card">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="company__icon">
                          <img src="assets/img/home-1/company/figma.svg" alt="" />
                        </div>
                        <div className="featured__option"></div>
                      </div>
                      <div className="d-flex mt-4 flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-location-dot" /> Newyork, USA
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-light fa-briefcase" /> Full Time
                        </div>
                      </div>
                      <div className="h6 job__title my-3">
                        <a href="#" aria-label="job">
                          Product Designer, Figma
                        </a>
                      </div>
                      <p>Consectetur adipisicing elit. Possimus aut mollitia eum ipsum fugiat odio officiis odit mollitia eum ipsum.</p>
                      <div className="job__tags d-flex mt-4 flex-wrap gap-2">
                        <a href="#">Skill</a>
                        <a href="#">user interface</a>
                        <a href="#">Problem Solving</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade list__style" role="tabpanel" id="list">
                <div className="row g-30">
                  {/* single item */}
                  <div className="col-lg-12">
                    <div className="rts__job__card__big style__gradient justify-content-between d-flex align-items-center flex-wrap gap-4">
                      <div className="d-flex flex-md-nowrap flex-lg-wrap flex-xl-nowrap align-items-center flex-wrap gap-4">
                        <div className="company__icon rounded-2">
                          <img src="assets/img/home-1/company/apple.svg" alt="" />
                        </div>
                        <div className="job__meta w-100 d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between align-items-center gap-3">
                            <a href="#" className="job__title h6 mb-0">
                              Senior UI Designer, Apple
                            </a>
                          </div>
                          <div className="d-flex gap-md-4 mb-2 flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light fa-location-dot" /> Newyork, USA
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light rt-briefcase" /> Full Time
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light fa-clock" /> 1 Years Ago
                            </div>
                          </div>
                          <div className="job__tags d-flex flex-wrap gap-3">
                            <a href="#">Creative</a>
                            <a href="#">user interface</a>
                            <a href="#">web ui</a>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button type="button" className="bookmark__btn">
                          <i className="rt-bookmark" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* single item end */}
                  {/* single item */}
                  <div className="col-lg-12">
                    <div className="rts__job__card__big style__gradient justify-content-between d-flex align-items-center flex-wrap gap-4">
                      <div className="d-flex flex-md-nowrap flex-lg-wrap flex-xl-nowrap align-items-center flex-wrap gap-4">
                        <div className="company__icon rounded-2">
                          <img src="assets/img/home-1/company/google.svg" alt="" />
                        </div>
                        <div className="job__meta w-100 d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between align-items-center gap-3">
                            <a href="#" className="job__title h6 mb-0">
                              Senior UX Designer, Google
                            </a>
                          </div>
                          <div className="d-flex gap-md-4 mb-2 flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light fa-location-dot" /> Newyork, USA
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light rt-briefcase" /> Full Time
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light fa-clock" /> 1 Years Ago
                            </div>
                          </div>
                          <div className="job__tags d-flex flex-wrap gap-3">
                            <a href="#">Creative</a>
                            <a href="#">user interface</a>
                            <a href="#">web ui</a>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button type="button" className="bookmark__btn">
                          <i className="rt-bookmark" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* single item end */}
                  {/* single item */}
                  <div className="col-lg-12">
                    <div className="rts__job__card__big style__gradient justify-content-between d-flex align-items-center flex-wrap gap-4">
                      <div className="d-flex flex-md-nowrap flex-lg-wrap flex-xl-nowrap align-items-center flex-wrap gap-4">
                        <div className="company__icon rounded-2">
                          <img src="assets/img/home-1/company/microsoft.svg" alt="" />
                        </div>
                        <div className="job__meta w-100 d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between align-items-center gap-3">
                            <a href="#" className="job__title h6 mb-0">
                              Software Engineer, Bing
                            </a>
                          </div>
                          <div className="d-flex gap-md-4 mb-2 flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light fa-location-dot" /> Newyork, USA
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light rt-briefcase" /> Full Time
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light fa-clock" /> 1 Years Ago
                            </div>
                          </div>
                          <div className="job__tags d-flex flex-wrap gap-3">
                            <a href="#">Creative</a>
                            <a href="#">user interface</a>
                            <a href="#">web ui</a>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button type="button" className="bookmark__btn">
                          <i className="rt-bookmark" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* single item end */}
                  {/* single item */}
                  <div className="col-lg-12">
                    <div className="rts__job__card__big style__gradient justify-content-between d-flex align-items-center flex-wrap gap-4">
                      <div className="d-flex flex-md-nowrap flex-lg-wrap flex-xl-nowrap align-items-center flex-wrap gap-4">
                        <div className="company__icon rounded-2">
                          <img src="assets/img/home-1/company/upwork.svg" alt="" />
                        </div>
                        <div className="job__meta w-100 d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between align-items-center gap-3">
                            <a href="#" className="job__title h6 mb-0">
                              Web developer, Upwork
                            </a>
                          </div>
                          <div className="d-flex gap-md-4 mb-2 flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light fa-location-dot" /> Newyork, USA
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light rt-briefcase" /> Full Time
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light fa-clock" /> 1 Years Ago
                            </div>
                          </div>
                          <div className="job__tags d-flex flex-wrap gap-3">
                            <a href="#">Creative</a>
                            <a href="#">user interface</a>
                            <a href="#">web ui</a>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button type="button" className="bookmark__btn">
                          <i className="rt-bookmark" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* single item end */}
                  {/* single item */}
                  <div className="col-lg-12">
                    <div className="rts__job__card__big style__gradient justify-content-between d-flex align-items-center flex-wrap gap-4">
                      <div className="d-flex flex-md-nowrap flex-lg-wrap flex-xl-nowrap align-items-center flex-wrap gap-4">
                        <div className="company__icon rounded-2">
                          <img src="assets/img/home-1/company/in.svg" alt="" />
                        </div>
                        <div className="job__meta w-100 d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between align-items-center gap-3">
                            <a href="#" className="job__title h6 mb-0">
                              Graphic Designer, Linkedin
                            </a>
                          </div>
                          <div className="d-flex gap-md-4 mb-2 flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light fa-location-dot" /> Newyork, USA
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light rt-briefcase" /> Full Time
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light fa-clock" /> 1 Years Ago
                            </div>
                          </div>
                          <div className="job__tags d-flex flex-wrap gap-3">
                            <a href="#">Creative</a>
                            <a href="#">user interface</a>
                            <a href="#">web ui</a>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button type="button" className="bookmark__btn">
                          <i className="rt-bookmark" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* single item end */}
                  {/* single item */}
                  <div className="col-lg-12">
                    <div className="rts__job__card__big style__gradient justify-content-between d-flex align-items-center flex-wrap gap-4">
                      <div className="d-flex flex-md-nowrap flex-lg-wrap flex-xl-nowrap align-items-center flex-wrap gap-4">
                        <div className="company__icon rounded-2">
                          <img src="assets/img/home-1/company/facebook.svg" alt="" />
                        </div>
                        <div className="job__meta w-100 d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between align-items-center gap-3">
                            <a href="#" className="job__title h6 mb-0">
                              Digital Marketing, Facebook
                            </a>
                          </div>
                          <div className="d-flex gap-md-4 mb-2 flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light fa-location-dot" /> Newyork, USA
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light rt-briefcase" /> Full Time
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <i className="fa-light fa-clock" /> 1 Years Ago
                            </div>
                          </div>
                          <div className="job__tags d-flex flex-wrap gap-3">
                            <a href="#">Blog post</a>
                            <a href="#">e-commerce</a>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button type="button" className="bookmark__btn">
                          <i className="rt-bookmark" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* single item end */}
                </div>
              </div>
            </div>
            <div className="rts__pagination max-content mx-auto pt-60">
              <ul className="d-flex gap-2">
                <li>
                  <a href="#" className="inactive">
                    <i className="rt-chevron-left" />
                  </a>
                </li>
                <li>
                  <a className="active" href="#">
                    1
                  </a>
                </li>
                <li>
                  <a href="#">2</a>
                </li>
                <li>
                  <a href="#">3</a>
                </li>
                <li>
                  <a href="#">
                    <i className="rt-chevron-right" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsList;

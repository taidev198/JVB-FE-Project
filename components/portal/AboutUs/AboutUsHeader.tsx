import ChooseAboutUs from './ChooseAboutUs';
import UserAboutItem from './UserAboutItem';

const users = [
  {
    id: 1,
    name: 'Ban Van Viet',
    imgUrl: 'https://shreethemes.net/jobstock-landing-2.3/jobstock/assets/img/team-1.jpg',
    major: 'Front-end Development',
  },
  {
    id: 2,
    name: 'Ha Thi Huong',
    imgUrl: 'https://shreethemes.net/jobstock-landing-2.3/jobstock/assets/img/team-2.jpg',
    major: 'Front-end Development',
  },
  {
    id: 3,
    name: 'Phan Tuan Manh',
    imgUrl: 'https://shreethemes.net/jobstock-landing-2.3/jobstock/assets/img/team-3.jpg',
    major: 'Front-end Development',
  },
  {
    id: 4,
    name: 'Nguyen Anh Bich',
    imgUrl: 'https://shreethemes.net/jobstock-landing-2.3/jobstock/assets/img/team-10.jpg',
    major: 'Front-end Development',
  },
  {
    id: 5,
    name: 'Shaurya Preet',
    imgUrl: 'https://shreethemes.net/jobstock-landing-2.3/jobstock/assets/img/team-5.jpg',
    major: 'Co-Founder',
  },
  {
    id: 6,
    name: 'Shaurya Preet',
    imgUrl: 'https://shreethemes.net/jobstock-landing-2.3/jobstock/assets/img/team-6.jpg',
    major: 'Co-Founder',
  },
  {
    id: 7,
    name: 'Shaurya Preet',
    imgUrl: 'https://shreethemes.net/jobstock-landing-2.3/jobstock/assets/img/team-7.jpg',
    major: 'Co-Founder',
  },
  {
    id: 8,
    name: 'Shaurya Preet',
    imgUrl: 'https://shreethemes.net/jobstock-landing-2.3/jobstock/assets/img/team-8.jpg',
    major: 'Co-Founder',
  },
];

const chooseList = [
  {
    id: 1,
    number: '01',
    title: 'Create An Account',
    content:
      "Post A Job To Tell Us About Your Project. We'll Quickly Match You With The Right Freelancers Find Place Best. Nor again is there anyone who loves.",
  },
  {
    id: 2,
    number: '02',
    title: 'Search Jobs',
    content:
      "Post A Job To Tell Us About Your Project. We'll Quickly Match You With The Right Freelancers Find Place Best. Nor again is there anyone who loves.",
  },
  {
    id: 3,
    number: '03',
    title: 'Save & Apply Jobs',
    content:
      "Post A Job To Tell Us About Your Project. We'll Quickly Match You With The Right Freelancers Find Place Best. Nor again is there anyone who loves.",
  },
];

const AboutUsHeader = () => {
  return (
    <>
      <section className="bg-[url('https://shreethemes.net/jobstock-landing-2.3/jobstock/assets/img/about.jpg')] bg-cover bg-center bg-no-repeat pb-[80px] pt-[170px]">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex">
            <div className="w-[66.66666667%]">
              <h1 className="pb-6 text-[60.8px] font-semibold text-white">
                Who We are <br /> & Our Smart Mission
              </h1>
              <p className="text-sm text-white">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas
                molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et
                dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid grid-cols-12 gap-x-[110px]">
            <div className="col-span-6 px-3">
              <div>
                <h2 className="mb-2 text-[32px] font-semibold text-[#05264e]">Our Mission & Story</h2>
                <p className="mb-[10px] text-[19px] italic leading-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="mb-6 text-[19px] italic leading-8">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas
                  molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et
                  dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                </p>
              </div>
            </div>
            <div className="col-span-6">
              <div className="h-[600px]">
                <img src="https://shreethemes.net/jobstock-landing-2.3/jobstock/assets/img/bn-1.png" alt="" className="ml-auto h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f1f5f8] py-20">
        <div className="mx-auto max-w-[1320px] px-3">
          <div className="mb-8">
            <h2 className="mb-2 text-center text-[35px] font-semibold text-[#05264e]">Meet Our Team</h2>
            <p className="mb-1 text-center text-[15px] text-[#05264e]">Professional & Dedicated Team</p>
          </div>
          {/* Card */}
          <div className="grid grid-cols-4">
            {/* Card item */}
            {users.map(user => (
              <UserAboutItem key={user.id} imgUrl={user.imgUrl} name={user.name} major={user.major} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#01333f] py-20">
        <div className="mx-auto max-w-[1320px] px-3">
          <div className="mb-8">
            <h2 className="mb-2 text-center text-[35px] font-semibold text-white">Choose What You Need</h2>
            <p className="mb-1 text-center text-[15px] text-white">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
            </p>
          </div>
          {/* Card */}
          <div className="grid grid-cols-3">
            {chooseList.map(choice => (
              <ChooseAboutUs key={choice.id} number={choice.number} title={choice.title} desc={choice.content} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default AboutUsHeader;

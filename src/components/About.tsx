import logo from '@/assets/96.png'

const About = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col justify-center items-center font-bold text-center w-full min-w-75 bg-zinc-800 text-white p-4">
        <div className="text-center">
          <img src={logo} />
        </div>
        <h2 className="text-xl"> PH Js Kicker</h2>
        <p>Version 2.0.0</p>
      </div>
      <p className="text-sm">
        Made for PH Instructors for Kicking JS Assignments!
      </p>
      <p className="text-xs italic">by Abu Nayim Faisal</p>
    </div>
  );
};

export default About;

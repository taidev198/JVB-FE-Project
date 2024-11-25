import Head from 'next/head';
interface HomeProps {
  serverSideApiKeyIsSet: boolean;
}

const Home: React.FC<HomeProps> = () => {
  return (
    <>
      <Head>
        <title>Base</title>
        <meta name="description" content="" />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>index</main>
    </>
  );
};
export default Home;

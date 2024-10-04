import TokenIndex from "@/core/tokens";
import token from "@/unity/tokens";
import { GetServerSidePropsContext } from "next";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const tokens = context.query.tokens;
  const token_info = token.find(t => t.slug === tokens);

  if (!token_info) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: { token_info },
  }
}

const TokenPage = ({ token_info }: { token_info: token }) => {

  return (
    <TokenIndex token_info={token_info}/>
  );
}

export default TokenPage;
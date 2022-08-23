import { SignUpForm } from '@app/components/auth/SignUpForm/SignUpForm';
import * as S from './NewUser.styles';

const NewUser = () => {
  return (
    <S.Wrapper>
      <SignUpForm />
    </S.Wrapper>
  );
};

export default NewUser;

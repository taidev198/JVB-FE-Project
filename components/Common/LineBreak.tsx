import { useTranslation } from 'next-i18next';

interface ILineBreak {
  isPageLogin: boolean;
}

export const LineBreak = ({ isPageLogin }: ILineBreak) => {
  const { t } = useTranslation('common');
  return (
    <div className="relative flex items-center">
      <span className="mx-2 text-gray-400">{isPageLogin ? t('Login with SNS') : t('Register with SNS')}</span>
      <div className="h-1 flex-1 border-b border-[#535456]"></div>
    </div>
  );
};

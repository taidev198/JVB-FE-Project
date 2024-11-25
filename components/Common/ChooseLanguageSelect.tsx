import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  className?: string;
}

export const ChooseLanguageSelect = ({ className }: Props): JSX.Element => {
  const { i18n } = useTranslation();

  const router = useRouter();

  const changeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, {
      locale: newLocale,
    });
  };

  return (
    <select id="small" className={`change-language ${className}`} onChange={changeLanguage} value={i18n.language}>
      <option value="en" className="h-[38px]">
        EN
      </option>
      <option value="ja" className="h-[38px]">
        JP
      </option>
    </select>
  );
};

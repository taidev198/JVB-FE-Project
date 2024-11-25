import Image from 'next/image';
import { HTMLProps } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { ToolTip } from './ToolTip';
import IconFAQ from '@/assets/svg/icon_in_FAQ.svg';
import IconAggregateInformation from '@/assets/svg/icon_in_aggregate_information.svg';
import IconAssistantEducation from '@/assets/svg/icon_in_assistant_education.svg';
import IconCreationVideos from '@/assets/svg/icon_in_creation_videos.svg';
import IconPresent from '@/assets/svg/icon_in_present.svg';
import IconSummarize from '@/assets/svg/icon_in_summarize.svg';
import Overview1Svg from '@/assets/svg/overview_1.svg';

interface Props {
  className?: HTMLProps<HTMLElement>['className'];
}

export const IntroduceOverviewFeature = ({ className }: Props) => {
  const { t } = useTranslation('common');

  return (
    <div className={clsx('w-[350px] xs:w-[320px]', className)}>
      <div className="flex w-full items-center gap-[13px]">
        <div className="group relative">
          <Image src={Overview1Svg} alt="" width={131} height={113} />
          <ToolTip position="right">{t('Content Support')}</ToolTip>
        </div>
        <div
          className="[&>h2]:text-[16px] [&>h2]:font-[600] [&>p]:text-[.75rem]"
          dangerouslySetInnerHTML={{ __html: t('Complete privacy ChatGPT suitable for use by companies, organizations, and individuals.') }}></div>
      </div>
      <div className="flex w-full items-center justify-between sm:-translate-y-[12px]">
        <p className="flex-1 text-[.75rem]">{t('Improving operational efficiency with proprietary AI.')}</p>

        <div className="flex  !h-[108px] !w-[182px] flex-wrap items-start justify-between gap-y-[8px] [&>div]:h-[50px] [&>div]:w-[50px]">
          <div className="group relative">
            <Image src={IconPresent} alt="" className="Generating presentation materials" />
            <ToolTip position="top">{t('Generating presentation materials')}</ToolTip>
          </div>
          <div className="group relative">
            <Image src={IconFAQ} alt="Automation and unmanned help desk operations. Automatic generation of FAQs" />
            <ToolTip position="top">{t('Automation FAQ')}</ToolTip>
          </div>
          <div className="group relative">
            <Image src={IconSummarize} alt="Summarize minutes and materials" />
            <ToolTip position="top">{t('Summarize materials')}</ToolTip>
          </div>
          <div className="group relative">
            <Image src={IconAssistantEducation} alt="A unique AI assistant for education" />
            <ToolTip position="bottom">{t('Unique AI assistant for education')}</ToolTip>
          </div>
          <div className="group relative">
            <Image src={IconAggregateInformation} alt="Aggregate information from internal portal site" />
            <ToolTip position="bottom">{t('Aggregate information from internal portal site')}</ToolTip>
          </div>
          <div className="group relative">
            <Image src={IconCreationVideos} alt="Creation of various videos such as training and introduction" />
            <ToolTip position="bottom">{t('Creation of various videos such as training and introduction')}</ToolTip>
          </div>
        </div>
      </div>
    </div>
  );
};

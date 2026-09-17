import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { useIsActivePage, useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

import bctLogo from '@assets/logos/bct-logo-white.png';
import innodiskLogo from '@assets/logos/innodisk-wordmark.svg';

// Two tones carry the argument: warm ivory is human judgement, the accent is AI assistance.
export const design: DesignSystem = {
  palette: {
    bg: '#0A0D12',
    text: '#F4EDE3',
    accent: '#4D9DFF',
  },
  fonts: {
    display: '"Google Sans Flex", "Noto Sans TC", sans-serif',
    body: '"Noto Sans TC", "PingFang TC", sans-serif',
  },
  typeScale: {
    hero: 150,
    body: 25,
  },
  radius: 14,
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+TC:wght@300..900&display=swap';
const FONT_LINK_ID = 'osd-webfont-ai-recruiting';
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
}

const STYLE_ID = 'osd-styles-ai-recruiting';
const KEYFRAMES = '@keyframes ar-scan { 0% { transform: translateX(0) scaleX(.16) } 100% { transform: translateX(1430px) scaleX(.16) } }';
if (typeof document !== 'undefined') {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== KEYFRAMES) style.textContent = KEYFRAMES;
}

const dim = '#9AA3AE';
const faint = '#5A6470';
const panel = '#0F141B';
const panel2 = '#131A24';
const line = 'rgba(154,180,210,.14)';
const lineStrong = 'rgba(154,180,210,.24)';
const mono = '"IBM Plex Mono", ui-monospace, monospace';
const PAD_X = 104;

// Accent and text tints stay tied to the Design panel tokens.
const accentMix = (pct: number) => `color-mix(in srgb, var(--osd-accent) ${pct}%, transparent)`;
const textMix = (pct: number) => `color-mix(in srgb, var(--osd-text) ${pct}%, transparent)`;
const aiSoft = accentMix(12);
const aiLine = accentMix(36);

const root: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
};

const monoLabel: CSSProperties = {
  fontFamily: mono,
  fontSize: 17,
  letterSpacing: '.18em',
  textTransform: 'uppercase',
  color: faint,
};

const cjkLabel: CSSProperties = {
  fontSize: 19,
  letterSpacing: '.03em',
  color: faint,
};

const tLg: CSSProperties = { margin: 0, fontWeight: 500, fontSize: 30, lineHeight: 1.5 };
const tMd: CSSProperties = { margin: 0, fontWeight: 400, fontSize: 'var(--osd-size-body)', lineHeight: 1.62, color: dim };
const tSm: CSSProperties = { margin: 0, fontWeight: 400, fontSize: 21, lineHeight: 1.6, color: faint };

const Backdrop = () => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
        backgroundSize: '120px 120px',
        WebkitMaskImage: 'radial-gradient(ellipse 110% 85% at 20% 26%, #000 22%, transparent 76%)',
        maskImage: 'radial-gradient(ellipse 110% 85% at 20% 26%, #000 22%, transparent 76%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `radial-gradient(circle 990px at 1720px 100px, ${accentMix(16)}, ${accentMix(4)} 42%, transparent 66%)`,
      }}
    />
  </>
);

const footLabel: CSSProperties = {
  position: 'absolute',
  bottom: 20,
  fontFamily: mono,
  fontSize: 16,
  letterSpacing: '.16em',
  color: faint,
};

// The progress rail echoes the cover's recruitment pipeline, lit as the deck advances.
const ProgressFooter = ({ name }: { name: string }) => {
  const { current, total } = useSlidePageNumber();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: PAD_X,
          right: PAD_X,
          bottom: 52,
          height: 2,
          background: lineStrong,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${(current / total) * 100}%`,
            background: `linear-gradient(90deg, ${textMix(50)}, var(--osd-accent))`,
            boxShadow: `0 0 14px ${accentMix(55)}`,
          }}
        />
      </div>
      <div style={{ ...footLabel, left: PAD_X, textTransform: 'uppercase' }}>{name}</div>
      <div style={{ ...footLabel, right: PAD_X }}>
        {pad(current)} / {pad(total)}
      </div>
    </>
  );
};

const Shell = ({ footer, children }: { footer?: string; children: ReactNode }) => (
  <div style={root}>
    <Backdrop />
    {children}
    {footer && <ProgressFooter name={footer} />}
  </div>
);

const Frame = ({ name, children }: { name: string; children: ReactNode }) => (
  <Shell footer={name}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: `68px ${PAD_X}px 92px`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  </Shell>
);

const Head = ({ num, right, children }: { num: string; right?: ReactNode; children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 40,
      paddingBottom: 26,
      borderBottom: `1px solid ${line}`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
      <span
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontWeight: 700,
          fontSize: 22,
          color: 'var(--osd-accent)',
          letterSpacing: '.04em',
        }}
      >
        {num}
      </span>
      <h2 style={{ margin: 0, fontWeight: 700, fontSize: 54, lineHeight: 1.24, letterSpacing: '.01em' }}>{children}</h2>
    </div>
    {right && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexShrink: 0, paddingBottom: 8 }}>{right}</div>
    )}
  </div>
);

const Body = ({ gap = 34, children }: { gap?: number; children: ReactNode }) => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap,
      paddingTop: 34,
    }}
  >
    {children}
  </div>
);

const Take = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      borderLeft: '3px solid var(--osd-accent)',
      background: `linear-gradient(90deg, ${aiSoft}, transparent 72%)`,
      padding: '20px 28px',
      borderRadius: '0 12px 12px 0',
    }}
  >
    <p style={{ margin: 0, fontWeight: 500, fontSize: 26, lineHeight: 1.5 }}>{children}</p>
  </div>
);

const Dot = () => (
  <i
    style={{
      display: 'inline-block',
      flexShrink: 0,
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--osd-accent)',
      boxShadow: '0 0 12px var(--osd-accent)',
    }}
  />
);

const Chip = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      border: `1px solid ${aiLine}`,
      borderRadius: 999,
      padding: '7px 18px',
      fontFamily: mono,
      fontSize: 15,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--osd-accent)',
      background: aiSoft,
    }}
  >
    <Dot />
    {children}
  </div>
);

const Chevron = () => (
  <span
    style={{
      position: 'absolute',
      right: -17,
      top: '50%',
      width: 11,
      height: 11,
      borderTop: `1.5px solid ${lineStrong}`,
      borderRight: `1.5px solid ${lineStrong}`,
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 2,
    }}
  />
);

const Kick = ({ ai = false, flush = false, children }: { ai?: boolean; flush?: boolean; children: ReactNode }) => (
  <div
    style={{
      fontWeight: 500,
      fontSize: 19,
      letterSpacing: '.04em',
      color: ai ? 'var(--osd-accent)' : faint,
      marginBottom: flush ? 0 : 14,
    }}
  >
    {children}
  </div>
);

const InnodiskMark = () => <img src={innodiskLogo} alt="innodisk" style={{ height: 30, opacity: 0.95 }} />;

// ─── Cover ────────────────────────────────────────────────────────────────────

const PipelineRail = () => {
  const active = useIsActivePage();
  return (
    <div
      style={{
        position: 'absolute',
        left: PAD_X,
        right: PAD_X,
        bottom: 206,
        height: 2,
        background: `linear-gradient(90deg, ${textMix(30)}, ${accentMix(55)} 52%, ${textMix(30)})`,
      }}
    >
      {active && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, var(--osd-accent), transparent)',
            filter: 'blur(3px)',
            opacity: 0.9,
            transform: 'scaleX(.16)',
            transformOrigin: 'left',
            animation: 'ar-scan 5.2s cubic-bezier(.65,0,.35,1) infinite',
          }}
        />
      )}
    </div>
  );
};

const RailNode = ({ ai = false, children }: { ai?: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 250 }}>
    <i
      style={{
        display: 'block',
        width: 13,
        height: 13,
        borderRadius: '50%',
        marginTop: -42,
        background: ai ? 'var(--osd-accent)' : 'var(--osd-text)',
        boxShadow: ai ? `0 0 0 6px ${accentMix(16)}, 0 0 22px ${accentMix(70)}` : `0 0 0 6px ${textMix(9)}`,
      }}
    />
    <span style={{ fontSize: 22, fontWeight: ai ? 500 : 400, color: ai ? 'var(--osd-accent)' : faint }}>{children}</span>
  </div>
);

const Cover: Page = () => (
  <Shell>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: `70px ${PAD_X}px 0`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src={bctLogo} alt="Bahwan CyberTek" style={{ height: 40, opacity: 0.95 }} />
        <div style={monoLabel}>Talent Acquisition Automation</div>
      </div>
      <div style={{ marginTop: 110, maxWidth: 1440 }}>
        <Chip>Right People on the Bus</Chip>
        <h1
          style={{
            margin: '44px 0 38px',
            fontWeight: 900,
            fontSize: 'var(--osd-size-hero)',
            lineHeight: 1.06,
            letterSpacing: '.008em',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--osd-font-display)',
              fontWeight: 700,
              color: 'var(--osd-accent)',
              letterSpacing: '-.01em',
            }}
          >
            AI
          </span>{' '}
          智慧招募自動化
        </h1>
        <p style={{ margin: 0, fontWeight: 300, fontSize: 31, lineHeight: 1.76, color: dim, maxWidth: 1200 }}>
          運用 AI 與流程自動化，提升從人才吸引、履歷篩選到面試安排的招募效率。
          <br />
          <b style={{ fontWeight: 500, color: 'var(--osd-text)' }}>延伸企業既有 HR 系統能力，而非取代現有系統。</b>
        </p>
      </div>
    </div>
    <PipelineRail />
    <div
      style={{
        position: 'absolute',
        left: PAD_X,
        right: PAD_X,
        bottom: 152,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <RailNode>人才吸引</RailNode>
      <RailNode>履歷彙整</RailNode>
      <RailNode ai>AI 人才配對</RailNode>
      <RailNode>招募人員審核</RailNode>
      <RailNode ai>智慧面試排程</RailNode>
      <RailNode>人才評估</RailNode>
    </div>
  </Shell>
);

// ─── 01 · Context ─────────────────────────────────────────────────────────────

const StatCard = ({ ai = false, children }: { ai?: boolean; children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 448,
      padding: '32px 34px',
      borderRadius: 'var(--osd-radius)',
      background: ai ? `linear-gradient(180deg, ${aiSoft}, ${accentMix(3)})` : panel,
      border: `1px solid ${ai ? aiLine : line}`,
    }}
  >
    {children}
  </div>
);

const CardFoot = ({ ai = false, children }: { ai?: boolean; children: ReactNode }) => (
  <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${ai ? aiLine : line}` }}>{children}</div>
);

const bigNum: CSSProperties = {
  fontFamily: 'var(--osd-font-display)',
  fontWeight: 700,
  fontSize: 124,
  lineHeight: 0.92,
  letterSpacing: '-.02em',
};

const Context: Page = () => (
  <Frame name="Context">
    <Head num="01">當招募規模快速成長，如何更有效率地找到「對的人」？</Head>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.18fr 1fr', gap: 26 }}>
        <StatCard>
          <div>
            <Kick>2025 新進員工</Kick>
            <div style={bigNum}>
              638<span style={{ fontSize: 44, fontWeight: 500, marginLeft: 12 }}>人</span>
            </div>
          </div>
          <CardFoot>
            <p style={tMd}>2025 年研華台灣總部新進員工</p>
            <p style={{ ...tSm, marginTop: 8 }}>2024 年為 344 人</p>
          </CardFoot>
        </StatCard>
        <StatCard ai>
          <div>
            <Kick ai>研華人才招募核心理念</Kick>
            <p style={{ ...tLg, marginBottom: 22 }}>Right People on the Bus</p>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 40,
                lineHeight: 1.46,
                letterSpacing: '.01em',
                color: 'var(--osd-accent)',
              }}
            >
              「先找到對的人，
              <br />
              再決定要做什麼」
            </p>
          </div>
          <CardFoot ai>
            <p style={tSm}>人才決策的品質，決定後續所有決策的品質。</p>
          </CardFoot>
        </StatCard>
        <StatCard>
          <div>
            <Kick>Elite 招募計畫</Kick>
            <div style={bigNum}>
              23<span style={{ fontSize: 60 }}>%</span>
            </div>
          </div>
          <CardFoot>
            <p style={tMd}>2025 年 Elite 系列招募活動整體成效</p>
            <p style={{ ...tSm, marginTop: 8 }}>高於原訂 20% 目標</p>
          </CardFoot>
        </StatCard>
      </div>
      <Take>當招募規模持續成長，如何將「找到對的人」的能力，延伸到更大規模的日常招募流程？</Take>
    </Body>
  </Frame>
);

// ─── 02 · Process ─────────────────────────────────────────────────────────────

const StageCard = ({
  idx,
  title,
  link = false,
  children,
}: {
  idx: string;
  title: string;
  link?: boolean;
  children: ReactNode;
}) => (
  <div
    style={{
      position: 'relative',
      background: panel,
      border: `1px solid ${line}`,
      borderRadius: 12,
      padding: '26px 26px 24px',
      minHeight: 196,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}
  >
    <span
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontWeight: 700,
        fontSize: 19,
        color: faint,
        letterSpacing: '.06em',
      }}
    >
      {idx}
    </span>
    <h3 style={{ margin: 0, fontWeight: 500, fontSize: 26, lineHeight: 1.38 }}>{title}</h3>
    {children}
    {link && <Chevron />}
  </div>
);

const StageDesc = ({ children }: { children: ReactNode }) => (
  <p
    style={{
      margin: 0,
      fontSize: 18,
      lineHeight: 1.56,
      color: faint,
      lineBreak: 'strict',
      wordBreak: 'keep-all',
    }}
  >
    {children}
  </p>
);

const AiAssist = ({ children }: { children: ReactNode }) => (
  <span
    style={{
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      fontWeight: 500,
      fontSize: 19,
      color: 'var(--osd-accent)',
      borderTop: `1px dashed ${aiLine}`,
      paddingTop: 12,
    }}
  >
    <Dot />
    {children}
  </span>
);

const Process: Page = () => (
  <Frame name="Process">
    <Head num="02" right={<span style={cjkLabel}>現有流程 ＋ AI 增強點</span>}>
      AI 可以如何延伸既有招募流程？
    </Head>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px 22px' }}>
        <StageCard idx="01" title="多元人才來源" link>
          <StageDesc>
            104｜企業人才網站
            <br />
            員工推薦｜Elite 招募計畫
          </StageDesc>
        </StageCard>
        <StageCard idx="02" title="履歷彙整" link>
          <StageDesc>不同來源的履歷進入統一流程</StageDesc>
        </StageCard>
        <StageCard idx="03" title="履歷篩選與人才初步排序" link>
          <AiAssist>AI 人才適配分析</AiAssist>
        </StageCard>
        <StageCard idx="04" title="招募人員審核">
          <AiAssist>AI 協助候選人優先排序</AiAssist>
        </StageCard>
        <StageCard idx="05" title="用人主管審核" link>
          <StageDesc>確認人選是否符合團隊需求</StageDesc>
        </StageCard>
        <StageCard idx="06" title="面試安排" link>
          <AiAssist>智慧面試排程</AiAssist>
        </StageCard>
        <StageCard idx="07" title="面試評估與人才決策" link>
          <StageDesc>彙整面試回饋，決定錄用人選</StageDesc>
        </StageCard>
        <StageCard idx="08" title="錄用與新人報到">
          <StageDesc>完成錄取流程並銜接報到</StageDesc>
        </StageCard>
      </div>
      <Take>AI 協助分析與排序，最終人才決策仍由招募人員與用人主管負責。</Take>
    </Body>
  </Frame>
);

// ─── 03 · Innodisk before / after ─────────────────────────────────────────────

const BAHead = ({ tag, children }: { tag: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
    <span style={{ fontWeight: 700, fontSize: 28 }}>{children}</span>
    <span style={{ fontFamily: mono, fontSize: 15, letterSpacing: '.16em', textTransform: 'uppercase', color: faint }}>
      {tag}
    </span>
  </div>
);

const BAStep = ({ after = false, children }: { after?: boolean; children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '17px 22px',
      borderRadius: 10,
      fontSize: 23,
      background: after ? panel2 : panel,
      border: `1px solid ${after ? lineStrong : line}`,
      color: after ? 'var(--osd-text)' : dim,
    }}
  >
    <i style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', background: faint, flexShrink: 0 }} />
    {children}
  </div>
);

const baCol: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 11 };

const BeforeAfter: Page = () => (
  <Frame name="Innodisk · Before / After">
    <Head
      num="03"
      right={
        <>
          <span style={monoLabel}>Case Study</span>
          <InnodiskMark />
        </>
      }
    >
      宜鼎案例：從分散作業走向 AI 智慧招募
    </Head>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px 1fr', gap: 28, alignItems: 'stretch' }}>
        <div style={baCol}>
          <BAHead tag="Before">導入前</BAHead>
          <BAStep>多來源履歷</BAStep>
          <BAStep>人工整理</BAStep>
          <BAStep>逐份履歷篩選</BAStep>
          <BAStep>人工聯繫候選人</BAStep>
          <BAStep>往返確認面試時間</BAStep>
          <BAStep>安排面試</BAStep>
          <BAStep>整理面試結果</BAStep>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 22,
            padding: '30px 22px',
            borderRadius: 'var(--osd-radius)',
            background: `linear-gradient(180deg, ${accentMix(10)}, ${accentMix(2)})`,
            border: `1px solid ${aiLine}`,
          }}
        >
          <img src={bctLogo} alt="Bahwan CyberTek" style={{ height: 30, opacity: 0.95 }} />
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 27,
              lineHeight: 1.42,
              color: 'var(--osd-accent)',
              textAlign: 'center',
            }}
          >
            AI 智慧招募
            <br />
            自動化
          </p>
          <p style={{ ...tSm, textAlign: 'center' }}>
            AI 協助排序
            <br />
            HR 掌握最終決策
          </p>
        </div>
        <div style={baCol}>
          <BAHead tag="After">導入後</BAHead>
          <BAStep after>履歷集中彙整</BAStep>
          <BAStep after>AI 人才適配分析</BAStep>
          <BAStep after>候選人優先排序</BAStep>
          <BAStep after>招募人員審核</BAStep>
          <BAStep after>候選人自動通知</BAStep>
          <BAStep after>智慧面試排程</BAStep>
          <BAStep after>面試評估集中管理</BAStep>
        </div>
      </div>
    </Body>
  </Frame>
);

// ─── 04 · Innodisk in practice ────────────────────────────────────────────────

const FlowCol = ({ children }: { children: ReactNode }) => (
  <div style={{ position: 'relative', paddingLeft: 78 }}>
    <span
      style={{
        position: 'absolute',
        left: 25,
        top: 34,
        bottom: 34,
        width: 2,
        background: `linear-gradient(180deg, transparent, ${lineStrong} 12%, ${lineStrong} 88%, transparent)`,
      }}
    />
    {children}
  </div>
);

const FlowItem = ({
  n,
  title,
  first = false,
  children,
}: {
  n: string;
  title: string;
  first?: boolean;
  children: ReactNode;
}) => (
  <div style={{ position: 'relative', padding: '24px 0 28px', borderTop: first ? 'none' : `1px solid ${line}` }}>
    <span
      style={{
        position: 'absolute',
        left: -78,
        top: 26,
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: panel,
        border: `1px solid ${lineStrong}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--osd-font-display)',
        fontWeight: 700,
        fontSize: 20,
        color: dim,
      }}
    >
      {n}
    </span>
    <h3 style={{ margin: '0 0 9px', fontWeight: 500, fontSize: 29, lineHeight: 1.34 }}>{title}</h3>
    <p style={{ margin: 0, fontSize: 21, lineHeight: 1.56, color: faint, wordBreak: 'keep-all' }}>{children}</p>
  </div>
);

const InPractice: Page = () => (
  <Frame name="Innodisk · In Practice">
    <Head
      num="04"
      right={
        <>
          <span style={cjkLabel}>從一個職缺開始</span>
          <InnodiskMark />
        </>
      }
    >
      宜鼎案例：招募人員實際怎麼使用？
    </Head>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 96px' }}>
        <FlowCol>
          <FlowItem n="01" title="建立職缺需求" first>
            招募人員與用人主管確認人才條件
          </FlowItem>
          <FlowItem n="02" title="彙整候選人履歷">
            不同招募來源的履歷進入統一流程
          </FlowItem>
          <FlowItem n="03" title="AI 人才適配分析">
            依職缺條件與候選人履歷進行分析與優先排序
          </FlowItem>
          <FlowItem n="04" title="招募人員審核">
            優先檢視高適配候選人，最終篩選由招募人員決定
          </FlowItem>
        </FlowCol>
        <FlowCol>
          <FlowItem n="05" title="用人主管確認" first>
            將合適候選人提供用人主管進一步審核
          </FlowItem>
          <FlowItem n="06" title="發送面試邀請">
            系統依條件自動通知候選人
          </FlowItem>
          <FlowItem n="07" title="智慧面試排程">
            協調候選人、面試主管與會議資源
          </FlowItem>
          <FlowItem n="08" title="面試與評估">
            彙整面試結果，協助後續人才決策
          </FlowItem>
        </FlowCol>
      </div>
      <Take>從一個職缺開始，看 AI 如何融入日常招募工作。</Take>
    </Body>
  </Frame>
);

// ─── 05 · Impact ──────────────────────────────────────────────────────────────

const cmpGrid: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr' };
const cmpCell: CSSProperties = { padding: '15px 26px', fontSize: 23, lineHeight: 1.42 };

const CompareRow = ({ before, after, last = false }: { before: string; after: string; last?: boolean }) => (
  <div style={{ ...cmpGrid, borderBottom: last ? 'none' : `1px solid ${line}` }}>
    <div style={{ ...cmpCell, color: dim }}>{before}</div>
    <div
      style={{
        ...cmpCell,
        fontWeight: 500,
        background: accentMix(4.5),
        borderRadius: last ? '0 0 11px 0' : 0,
      }}
    >
      {after}
    </div>
  </div>
);

const Band = ({ ai = false, title, children }: { ai?: boolean; title: string; children: ReactNode }) => (
  <div
    style={{
      border: `1px solid ${ai ? aiLine : line}`,
      borderRadius: 12,
      padding: '20px 26px',
      background: ai ? `linear-gradient(180deg, ${aiSoft}, ${accentMix(2)})` : panel,
    }}
  >
    <Kick ai={ai} flush>
      {title}
    </Kick>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 14px', marginTop: 12 }}>{children}</div>
  </div>
);

const Pill = ({ ai = false, children }: { ai?: boolean; children: ReactNode }) => (
  <span
    style={{
      fontSize: 21,
      fontWeight: ai ? 500 : 400,
      color: ai ? 'var(--osd-accent)' : dim,
      border: `1px solid ${ai ? aiLine : line}`,
      borderRadius: 999,
      padding: '6px 16px',
      background: 'rgba(255,255,255,.02)',
    }}
  >
    {children}
  </span>
);

const Impact: Page = () => (
  <Frame name="Impact">
    <Head
      num="05"
      right={
        <>
          <span style={monoLabel}>Case Study</span>
          <InnodiskMark />
        </>
      }
    >
      宜鼎案例：導入前後的招募流程改變
    </Head>
    <Body gap={24}>
      <div style={{ border: `1px solid ${line}`, borderRadius: 12 }}>
        <div
          style={{
            ...cmpGrid,
            background: panel,
            borderBottom: `1px solid ${lineStrong}`,
            borderRadius: '11px 11px 0 0',
            fontWeight: 500,
            fontSize: 19,
            letterSpacing: '.03em',
          }}
        >
          <div style={{ padding: '16px 26px', color: faint }}>導入前</div>
          <div style={{ padding: '16px 26px', color: 'var(--osd-accent)' }}>導入後</div>
        </div>
        <CompareRow before="不同來源履歷人工整理" after="履歷集中彙整" />
        <CompareRow before="招募人員逐份進行初步篩選" after="AI 協助排序，優先檢視高適配人才" />
        <CompareRow before="人工寄送候選人通知" after="依招募階段自動通知" />
        <CompareRow before="Email 往返確認面試時間" after="智慧面試排程" />
        <CompareRow before="人工確認主管與會議資源" after="自動協調可用時間與資源" />
        <CompareRow before="面試回饋分散" after="評估結果集中彙整" last />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Band title="預期價值">
          <Pill>減少重複性行政工作</Pill>
          <Pill>縮短招募作業時間</Pill>
          <Pill>提升人才篩選效率</Pill>
          <Pill>改善候選人體驗</Pill>
        </Band>
        <Band ai title="建議成效衡量指標">
          <Pill ai>履歷初篩時間 ↓</Pill>
          <Pill ai>面試安排時間 ↓</Pill>
          <Pill ai>招募行政作業時間 ↓</Pill>
          <Pill ai>用人主管接受推薦人選比例 ↑</Pill>
        </Band>
      </div>
    </Body>
  </Frame>
);

// ─── 06 · Architecture ────────────────────────────────────────────────────────

const Layer = ({
  core = false,
  tag,
  title,
  mark,
  children,
}: {
  core?: boolean;
  tag: string;
  title: string;
  mark?: string;
  children: ReactNode;
}) => (
  <div
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 34,
      padding: '24px 34px',
      borderRadius: 'var(--osd-radius)',
      background: core ? `linear-gradient(90deg, ${accentMix(15)}, ${accentMix(4)})` : panel,
      border: `1px solid ${core ? aiLine : line}`,
    }}
  >
    <div style={{ flexShrink: 0, width: 400, display: 'flex', flexDirection: 'column', gap: 9 }}>
      <span style={{ fontFamily: mono, fontSize: 15, letterSpacing: '.16em', textTransform: 'uppercase', color: faint }}>
        {tag}
      </span>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontWeight: 700,
          fontSize: 29,
          color: core ? 'var(--osd-accent)' : 'var(--osd-text)',
        }}
      >
        {mark && <img src={mark} alt="Bahwan CyberTek" style={{ height: 26, opacity: 0.95, flexShrink: 0 }} />}
        {title}
      </span>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 12px' }}>{children}</div>
  </div>
);

const LayerChip = ({ core = false, children }: { core?: boolean; children: ReactNode }) => (
  <span
    style={{
      fontSize: 22,
      fontWeight: core ? 500 : 400,
      color: core ? 'var(--osd-accent)' : dim,
      border: `1px solid ${core ? aiLine : line}`,
      borderRadius: 8,
      padding: '9px 18px',
      background: core ? accentMix(6) : 'rgba(255,255,255,.02)',
    }}
  >
    {children}
  </span>
);

const Down = () => (
  <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 24, color: faint, lineHeight: 1 }}>↓</div>
);

const Architecture: Page = () => (
  <Frame name="Architecture">
    <Head num="06">延伸既有 HR 生態系，而非取代現有系統</Head>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <Layer tag="Sources" title="人才來源">
          <LayerChip>104</LayerChip>
          <LayerChip>企業人才網站</LayerChip>
          <LayerChip>員工推薦</LayerChip>
          <LayerChip>其他招募管道</LayerChip>
        </Layer>
        <Down />
        <Layer core tag="Automation Layer" title="AI 智慧招募自動化" mark={bctLogo}>
          <LayerChip core>履歷整合</LayerChip>
          <LayerChip core>AI 人才適配</LayerChip>
          <LayerChip core>候選人優先排序</LayerChip>
          <LayerChip core>流程自動化</LayerChip>
          <LayerChip core>面試協調</LayerChip>
          <LayerChip core>候選人溝通</LayerChip>
        </Layer>
        <Down />
        <Layer tag="Existing Systems" title="企業既有 HR 生態系">
          <LayerChip>Workday</LayerChip>
          <LayerChip>Email</LayerChip>
          <LayerChip>Calendar</LayerChip>
          <LayerChip>Teams</LayerChip>
          <LayerChip>其他企業系統</LayerChip>
        </Layer>
      </div>
      <Take>保留既有 HR 投資，補足跨平台、跨角色與跨流程的自動化需求。</Take>
      <p style={{ margin: 0, fontSize: 20, lineHeight: 1.6, color: faint }}>
        研華自 2023 年正式導入 Workday，並已應用於人才發展及內部轉調等流程。
      </p>
    </Body>
  </Frame>
);

// ─── 07 · Roadmap ─────────────────────────────────────────────────────────────

const Phase = ({
  n,
  tag,
  title,
  lead,
  link = false,
  children,
}: {
  n: string;
  tag: string;
  title: string;
  lead: string;
  link?: boolean;
  children: ReactNode;
}) => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      minHeight: 430,
      padding: '30px 28px',
      borderRadius: 'var(--osd-radius)',
      background: panel,
      border: `1px solid ${line}`,
    }}
  >
    <span
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontWeight: 700,
        fontSize: 52,
        lineHeight: 0.9,
        color: 'rgba(154,180,210,.20)',
      }}
    >
      {n}
    </span>
    <div>
      <span style={{ fontFamily: mono, fontSize: 14, letterSpacing: '.16em', textTransform: 'uppercase', color: faint }}>
        {tag}
      </span>
      <h3 style={{ margin: '8px 0 0', fontWeight: 700, fontSize: 28 }}>{title}</h3>
    </div>
    <p style={tSm}>{lead}</p>
    <ul style={{ listStyle: 'none', margin: '2px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
      {children}
    </ul>
    {link && <Chevron />}
  </div>
);

const PhaseItem = ({ children }: { children: ReactNode }) => (
  <li
    style={{
      position: 'relative',
      paddingLeft: 18,
      fontSize: 20,
      lineHeight: 1.48,
      color: dim,
      wordBreak: 'keep-all',
    }}
  >
    <i
      style={{
        position: 'absolute',
        left: 0,
        top: 11,
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: faint,
      }}
    />
    {children}
  </li>
);

const Roadmap: Page = () => (
  <Frame name="Roadmap">
    <Head num="07" right={<span style={monoLabel}>Proposed Roadmap</span>}>
      從一個高價值招募情境開始
    </Head>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
        <Phase n="01" tag="Phase 1" title="了解現況" lead="選擇具代表性的 AI、研發或工程職缺" link>
          <PhaseItem>履歷來源</PhaseItem>
          <PhaseItem>人才篩選方式</PhaseItem>
          <PhaseItem>用人主管協作</PhaseItem>
          <PhaseItem>面試安排</PhaseItem>
          <PhaseItem>既有 Workday 流程</PhaseItem>
        </Phase>
        <Phase n="02" tag="Phase 2" title="找出自動化機會" lead="盤點可由 AI 承接的重複性工作" link>
          <PhaseItem>AI 人才適配</PhaseItem>
          <PhaseItem>候選人優先排序</PhaseItem>
          <PhaseItem>面試排程</PhaseItem>
          <PhaseItem>候選人溝通</PhaseItem>
        </Phase>
        <Phase n="03" tag="Phase 3" title="小規模驗證" lead="選擇 1–3 個職缺，衡量：" link>
          <PhaseItem>履歷篩選時間</PhaseItem>
          <PhaseItem>招募行政作業時間</PhaseItem>
          <PhaseItem>推薦人選接受率</PhaseItem>
          <PhaseItem>面試安排效率</PhaseItem>
        </Phase>
        <Phase n="04" tag="Phase 4" title="逐步擴大" lead="驗證有效後往外延伸">
          <PhaseItem>更多職缺</PhaseItem>
          <PhaseItem>更多事業單位</PhaseItem>
          <PhaseItem>更多人才來源</PhaseItem>
          <PhaseItem>更多招募流程</PhaseItem>
        </Phase>
      </div>
      <Take>從一個實際招募情境開始，找出 AI 能降低重複性工作、同時強化「Right People on the Bus」的機會。</Take>
    </Body>
  </Frame>
);

// ─── Appendix ─────────────────────────────────────────────────────────────────

const AppendixRow = ({ n, first = false, children }: { n: string; first?: boolean; children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 40,
      padding: '42px 8px',
      borderBottom: `1px solid ${line}`,
      borderTop: first ? `1px solid ${line}` : 'none',
    }}
  >
    <span
      style={{
        width: 64,
        flexShrink: 0,
        fontFamily: 'var(--osd-font-display)',
        fontWeight: 700,
        fontSize: 30,
        color: 'var(--osd-accent)',
      }}
    >
      {n}
    </span>
    <span style={{ fontWeight: 500, fontSize: 38 }}>{children}</span>
  </div>
);

const Appendix: Page = () => (
  <Frame name="Appendix">
    <Head num="A" right={<img src={bctLogo} alt="Bahwan CyberTek" style={{ height: 30, opacity: 0.95 }} />}>
      Appendix
    </Head>
    <Body>
      <div style={{ marginTop: 46 }}>
        <AppendixRow n="A1" first>
          BCT 公司與台灣團隊介紹
        </AppendixRow>
        <AppendixRow n="A2">AI、資料、雲端與企業系統整合能力</AppendixRow>
        <AppendixRow n="A3">AI 智慧招募完整功能與延伸應用</AppendixRow>
      </div>
    </Body>
  </Frame>
);

// ─── Close ────────────────────────────────────────────────────────────────────

const Close: Page = () => (
  <Shell footer="Thank you">
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 52,
        padding: '0 200px',
        textAlign: 'center',
      }}
    >
      <Chip>Right People on the Bus</Chip>
      <h2 style={{ margin: 0, fontWeight: 700, fontSize: 62, lineHeight: 1.46 }}>
        先找到對的人，
        <br />
        再讓 <em style={{ fontStyle: 'normal', color: 'var(--osd-accent)' }}>AI</em> 把重複的工作接走。
      </h2>
      <p style={{ ...tMd, maxWidth: 1080 }}>延伸企業既有 HR 系統能力，從一個高價值招募情境開始驗證。</p>
      <img src={bctLogo} alt="Bahwan CyberTek" style={{ height: 44, opacity: 0.9, marginTop: 10 }} />
    </div>
  </Shell>
);

// ─── Motion ───────────────────────────────────────────────────────────────────

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

export const transition: SlideTransition = {
  duration: 200,
  exit: {
    duration: 140,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-4px)' },
    ],
  },
  enter: {
    duration: 200,
    delay: 80,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

Cover.transition = {
  duration: 280,
  exit: {
    duration: 160,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-6px)' },
    ],
  },
  enter: {
    duration: 280,
    delay: 100,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};

export const meta: SlideMeta = {
  title: 'AI 智慧招募自動化',
  createdAt: '2026-09-17T00:45:14.527Z',
};

export default [
  Cover,
  Context,
  Process,
  BeforeAfter,
  InPractice,
  Impact,
  Architecture,
  Roadmap,
  Appendix,
  Close,
] satisfies Page[];

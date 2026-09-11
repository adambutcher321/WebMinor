import Image from 'next/image';
import page from '../klik.module.css';
import s from './howitworks.module.css';

/*
  The two light bands.

  Everything on this page used to sit on some shade between #0e0e0e and
  #232323 for about ten thousand pixels, which is why it read as one long
  tunnel. These break that run twice, and they do it the way the bar asks: a
  torn edge at each boundary rather than a fade or a straight rule (M4).
*/

const STEPS = [
  {
    title: 'Get the app',
    body: 'Download it, point your camera at your ID, take one photo of your face. No branch, no appointment, no paperwork.',
    time: '2 minutes',
  },
  {
    title: 'Move your money',
    body: 'Bring your balance over from any UK bank, or top up from a card. Your salary can follow whenever you are ready.',
    time: '60 seconds',
  },
  {
    title: 'Spend it anywhere',
    body: 'Your virtual card works before the real one lands. Tap in 180 countries and see the exchange rate before you pay.',
    time: 'Straight away',
  },
];

export function HowItWorks() {
  return (
    <section className={page.paper} id="how">
      <span className={page.tearTop} aria-hidden="true" />
      <div className={s.wrap}>
        <div className={s.head}>
          <p className={s.kicker}>Getting started</p>
          <h2 className={`${page.display} ${s.title}`}>Three minutes, start to spending.</h2>
        </div>

        <ol className={s.steps}>
          {STEPS.map((step, i) => (
            <li className={s.step} key={step.title}>
              <span className={s.stepNo}>{i + 1}</span>
              <h3 className={s.stepTitle}>{step.title}</h3>
              <p className={s.stepBody}>{step.body}</p>
              <span className={s.stepTime}>{step.time}</span>
            </li>
          ))}
        </ol>
      </div>
      <span className={page.tearBottom} aria-hidden="true" />
    </section>
  );
}

const FEES = [
  { name: 'Monthly account fee', note: 'The account, the app and the virtual card.', value: 'Free' },
  { name: 'Spending abroad', note: 'Real exchange rate, shown before you tap.', value: 'Free' },
  { name: 'Sending to a friend', note: 'Any UK account, any amount, any time of night.', value: 'Free' },
  { name: 'Cash withdrawals', note: 'First £400 each month, then 2% after that.', value: 'Free' },
  { name: 'The metal card', note: 'Optional. Heavier than it needs to be, deliberately.', value: '£9/mo' },
];

export function Fees() {
  return (
    <section className={page.paper} id="fees">
      <span className={page.tearTop} aria-hidden="true" />
      <div className={s.wrap}>
        <div className={s.head}>
          <p className={s.kicker}>What it costs</p>
          <h2 className={`${page.display} ${s.title}`}>Almost all of it is nothing.</h2>
        </div>

        <div className={s.feeGrid}>
          {FEES.map((fee) => (
            <div className={s.feeRow} key={fee.name}>
              <p className={s.feeName}>{fee.name}</p>
              <p className={s.feeNote}>{fee.note}</p>
              <span className={s.feeVal}>
                {fee.value === 'Free' ? <span className={s.feeFree}>Free</span> : fee.value}
              </span>
            </div>
          ))}
        </div>

        <p className={s.feeFoot}>
          No overdraft you did not ask for, no fee for going a penny under, and no
          charge for closing the account and walking away.
        </p>

        {/* M6 keeps the character rationed, so he gets one appearance on paper
            and it is the one that lands the argument. */}
        <div className={s.payoff}>
          <div className={s.payoffFig}>
            <Image
              src="/demo/klik/char-thumbs.webp"
              alt="The KLIK monster giving an enthusiastic double thumbs up"
              width={1024}
              height={1024}
              sizes="(max-width: 859px) 60vw, 260px"
            />
          </div>
          <blockquote className={`${page.display} ${s.payoffQuote}`}>
            He checked. There is <em>genuinely</em> no catch.
          </blockquote>
        </div>
      </div>
      <span className={page.tearBottom} aria-hidden="true" />
    </section>
  );
}

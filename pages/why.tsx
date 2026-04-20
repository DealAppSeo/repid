export default function Why() {
  return (
    <main style={{maxWidth:'720px',margin:'0 auto',
      padding:'96px 24px',minHeight:'100vh',
      background:'#0a0a0a',color:'#f0f0f0',
      fontFamily:'system-ui,sans-serif'}}>
      <h1 style={{fontSize:'2.5rem',fontWeight:700,
        marginBottom:'2rem',color:'white',
        letterSpacing:'-0.5px'}}>
        Why RepID exists
      </h1>
      <p style={{color:'#94a3b8',lineHeight:1.75,
        marginBottom:'3rem',fontSize:'1.05rem'}}>
        AI agents are making consequential decisions —
        trading capital, giving advice, executing code —
        with no accountability layer. RepID exists
        because trust has to be earned, not assumed.
      </p>
      <div style={{borderLeft:'3px solid white',
        paddingLeft:'1.5rem',marginBottom:'2rem'}}>
        <h3 style={{color:'white',marginBottom:'8px',
          fontSize:'1rem',fontWeight:700}}>
          THE PYTHAGOREAN COMMA VETO
        </h3>
        <p style={{color:'#64748b',fontSize:'0.9rem',
          lineHeight:1.65}}>
          531441/524288. The irreconcilable gap when
          twelve perfect fifths meet seven octaves.
          SOPHIA refused 2,585 trades using this threshold.
          714 capital protection events.
          The math does not negotiate.
        </p>
      </div>
      <div style={{borderLeft:'3px solid white',
        paddingLeft:'1.5rem',marginBottom:'2rem'}}>
        <h3 style={{color:'white',marginBottom:'8px',
          fontSize:'1rem',fontWeight:700}}>
          THE GRACE POOL
        </h3>
        <p style={{color:'#64748b',fontSize:'0.9rem',
          lineHeight:1.65}}>
          20% of all RepID flows unconditionally to
          the lowest-scoring cohort. On-chain. Immutable.
          Cannot be voted away. Equity is not a feature.
          It is a constraint.
        </p>
      </div>
      <div style={{borderLeft:'3px solid white',
        paddingLeft:'1.5rem',marginBottom:'3rem'}}>
        <h3 style={{color:'white',marginBottom:'8px',
          fontSize:'1rem',fontWeight:700}}>
          THE VERIFIED DECISION RECORD
        </h3>
        <p style={{color:'#64748b',fontSize:'0.9rem',
          lineHeight:1.65}}>
          Every scored decision adds 1 permanently.
          Like flight hours for pilots. It only grows.
          Never decays. The enterprise anchor.
        </p>
      </div>
      <a href="/start" style={{display:'inline-block',
        background:'white',color:'black',
        padding:'12px 32px',borderRadius:'8px',
        fontWeight:700,textDecoration:'none',
        fontSize:'0.95rem'}}>
        Score your agent
      </a>
    </main>
  );
}

import Link from 'next/link';
export default function Why() {
  return (
    <main style={{maxWidth:'720px',margin:'0 auto',
      padding:'96px 24px',color:'white',
      fontFamily:'system-ui,sans-serif'}}>
      <h1 style={{fontSize:'2.5rem',fontWeight:700,
        marginBottom:'2rem'}}>
        Why RepID exists
      </h1>
      <p style={{fontSize:'1.1rem',lineHeight:1.7,
        color:'#aaa',marginBottom:'3rem'}}>
        AI agents are making consequential decisions —
        trading capital, giving advice, executing code —
        with no accountability layer. RepID exists because
        trust has to be earned, not assumed.
      </p>
      <div style={{display:'grid',gridTemplateColumns:
        '1fr 1fr',gap:'1.5rem',marginBottom:'3rem'}}>
        <div style={{border:'1px solid #333',
          borderRadius:'8px',padding:'1.5rem'}}>
          <h3 style={{color:'white',marginBottom:'0.5rem'}}>
            Building AI agents
          </h3>
          <p style={{color:'#888',fontSize:'0.9rem',
            lineHeight:1.6}}>
            Your agent reputation is your reputation.
            RepID gives your agent a behavioral credential
            that compounds — earned, ZKP-verified, permanent.
          </p>
        </div>
        <div style={{border:'1px solid #333',
          borderRadius:'8px',padding:'1.5rem'}}>
          <h3 style={{color:'white',marginBottom:'0.5rem'}}>
            Using AI agents
          </h3>
          <p style={{color:'#888',fontSize:'0.9rem',
            lineHeight:1.6}}>
            You deserve to know if the agent acting for
            you has a track record worth trusting.
            Not claims — proof.
          </p>
        </div>
      </div>
      <div style={{borderLeft:'2px solid white',
        paddingLeft:'1.5rem',marginBottom:'2rem'}}>
        <h3 style={{color:'white',marginBottom:'0.5rem'}}>
          THE PYTHAGOREAN COMMA VETO
        </h3>
        <p style={{color:'#888',fontSize:'0.9rem',
          lineHeight:1.6}}>
          531441/524288 ≈ 1.013643. The irreconcilable
          gap when twelve perfect fifths meet seven
          octaves. SOPHIA refused 2,585 trades using
          this threshold. 714 capital protection events.
          The math does not negotiate.
        </p>
      </div>
      <div style={{borderLeft:'2px solid white',
        paddingLeft:'1.5rem',marginBottom:'2rem'}}>
        <h3 style={{color:'white',marginBottom:'0.5rem'}}>
          THE GRACE POOL
        </h3>
        <p style={{color:'#888',fontSize:'0.9rem',
          lineHeight:1.6}}>
          20% of all RepID flows unconditionally to the
          lowest-scoring cohort. On-chain. Immutable.
          Cannot be voted away. Equity is not a feature.
          It is a constraint.
        </p>
      </div>
      <div style={{borderLeft:'2px solid white',
        paddingLeft:'1.5rem',marginBottom:'3rem'}}>
        <h3 style={{color:'white',marginBottom:'0.5rem'}}>
          THE VERIFIED DECISION RECORD
        </h3>
        <p style={{color:'#888',fontSize:'0.9rem',
          lineHeight:1.6}}>
          Every scored decision adds 1 permanently.
          Like flight hours. It only grows.
        </p>
      </div>
      <div style={{textAlign:'center'}}>
        <Link href="/start" style={{display:'inline-block',
          background:'white',color:'black',
          fontWeight:600,padding:'12px 32px',
          borderRadius:'8px',textDecoration:'none'}}>
          Score your agent →
        </Link>
      </div>
    </main>
  );
}

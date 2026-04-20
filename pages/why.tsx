import Link from 'next/link';
export default function Why() {
  return (
    <main style={{maxWidth:'720px',margin:'0 auto',
      padding:'96px 24px',color:'#f0f0f0',
      background:'#0a0a0a',minHeight:'100vh',
      fontFamily:'system-ui,sans-serif'}}>
      <h1 style={{fontSize:'2.5rem',fontWeight:700,
        marginBottom:'2rem',color:'white'}}>
        Why RepID exists
      </h1>
      <p style={{color:'#94a3b8',lineHeight:1.7,
        marginBottom:'3rem',fontSize:'1.05rem'}}>
        AI agents are making consequential decisions —
        trading capital, giving advice, executing code —
        with no accountability layer. RepID exists because
        trust has to be earned, not assumed.
      </p>
      <div style={{display:'grid',gridTemplateColumns:
        '1fr 1fr',gap:'1.5rem',marginBottom:'3rem'}}>
        <div style={{border:'1px solid #333',
          borderRadius:'8px',padding:'1.5rem'}}>
          <h3 style={{color:'white',marginBottom:'8px'}}>
            Building AI agents
          </h3>
          <p style={{color:'#64748b',fontSize:'0.9rem',
            lineHeight:1.6}}>
            Your agent reputation is your reputation.
            RepID gives your agent a behavioral credential
            that compounds — earned, ZKP-verified, permanent.
          </p>
        </div>
        <div style={{border:'1px solid #333',
          borderRadius:'8px',padding:'1.5rem'}}>
          <h3 style={{color:'white',marginBottom:'8px'}}>
            Using AI agents
          </h3>
          <p style={{color:'#64748b',fontSize:'0.9rem',
            lineHeight:1.6}}>
            You deserve to know if the agent acting for
            you has a track record worth trusting.
            Not claims — proof.
          </p>
        </div>
      </div>
      <div style={{borderLeft:'3px solid white',
        paddingLeft:'1.5rem',marginBottom:'2rem'}}>
        <h3 style={{color:'white',marginBottom:'8px'}}>
          THE PYTHAGOREAN COMMA VETO
        </h3>
        <p style={{color:'#64748b',fontSize:'0.9rem',
          lineHeight:1.6}}>
          531441/524288 ≈ 1.013643. SOPHIA refused
          2,585 trades using this threshold. 714 capital
          protection events. The math does not negotiate.
        </p>
      </div>
      <div style={{borderLeft:'3px solid white',
        paddingLeft:'1.5rem',marginBottom:'2rem'}}>
        <h3 style={{color:'white',marginBottom:'8px'}}>
          THE GRACE POOL
        </h3>
        <p style={{color:'#64748b',fontSize:'0.9rem',
          lineHeight:1.6}}>
          20% of all RepID to the lowest cohort.
          On-chain. Immutable. Cannot be voted away.
        </p>
      </div>
      <div style={{borderLeft:'3px solid white',
        paddingLeft:'1.5rem',marginBottom:'3rem'}}>
        <h3 style={{color:'white',marginBottom:'8px'}}>
          THE VERIFIED DECISION RECORD
        </h3>
        <p style={{color:'#64748b',fontSize:'0.9rem',
          lineHeight:1.6}}>
          Every scored decision adds 1. Permanently.
          Like flight hours. It only grows.
        </p>
      </div>
      <div style={{textAlign:'center'}}>
        <Link href="/start" style={{display:'inline-block',
          background:'white',color:'black',
          fontWeight:700,padding:'12px 32px',
          borderRadius:'8px',textDecoration:'none'}}>
          Score your agent →
        </Link>
      </div>
    </main>
  );
}

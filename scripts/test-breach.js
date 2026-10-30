const crypto = require('crypto');

async function checkBreach(password) {
  const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { 'User-Agent': 'Node-Test' }
  });
  const text = await res.text();
  const lines = text.split('\n');
  for (const line of lines) {
    const [retSuffix, count] = line.trim().split(':');
    if (retSuffix === suffix) {
      return { breached: true, count: parseInt(count, 10) };
    }
  }
  return { breached: false, count: 0 };
}

async function run() {
  const candidates = ['938104', '710492', '582914', '948216', '391827'];
  for (const c of candidates) {
    const r = await checkBreach(c);
    console.log(c, r);
  }
}
run();


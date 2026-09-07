import { createApp } from './app.js';

const PORT = process.env.PORT || 4000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`SIRE 2.0 Vetting Inspector backend listening on port ${PORT}`);
});

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export const DictionaryApiService = {
  async lookupWord(word) {
    try {
      const response = await fetch(`${BASE_URL}/${encodeURIComponent(word)}`);
      if (!response.ok) return null;
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) return null;

      const entry = data[0];
      const phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || '';
      const meanings = entry.meanings?.slice(0, 2).map(m => ({
        partOfSpeech: m.partOfSpeech,
        definition: m.definitions?.[0]?.definition || '',
        example: m.definitions?.[0]?.example || '',
      }));

      return { word: entry.word, phonetic, meanings };
    } catch {
      return null;
    }
  },
};

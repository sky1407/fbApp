export function createMockPosts(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `post_mock_${index + 1}`,
    content: `<p>Toto je automatický testovací príspevok číslo <b>${index + 1}</b>. Obsahuje formátovaný text, ktorý simuluje príspevok na sieti.</p>`,
    thumbnail: index % 3 === 0 ? `https://picsum.photos/seed/wall-${index + 10}/800/400` : '',
    likes: Math.floor(Math.random() * 10),
    comments: [
      {
        id: `comment_mock_${index + 1}`,
        text: 'Skvelý príspevok! Veľmi sa mi páči toto moderné používateľské rozhranie.',
        likes: 2,
        replies: [
          {
            id: `reply_mock_${index + 1}`,
            text: 'Súhlasím, vyzerá to super!',
            likes: 1,
          },
        ],
      },
    ],
  }));
}

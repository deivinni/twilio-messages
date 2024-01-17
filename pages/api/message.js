function POST (request) {
  const { searchParams } = new URL(request);
  const message = searchParams.get("message");

  return <h1>{message}</h1>
}

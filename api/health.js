export default function handler(request, response) {
  response.status(200).json({
    ok: true,
    app: 'meemaw',
    youConfigured: Boolean(process.env.YDC_API_KEY),
  })
}

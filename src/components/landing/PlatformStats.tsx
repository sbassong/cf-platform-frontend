const stats = [
  { name: 'Active Members', value: '1,200+' },
  { name: 'Groups & Communities', value: '50+' },
  { name: 'Events This Month', value: '15+' },
]

export default function PlatformStats() {
  return (
    <div className="bg-indigo-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            A Thriving, Active Community
          </h2>
        </div>
        <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.name} className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">{stat.name}</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
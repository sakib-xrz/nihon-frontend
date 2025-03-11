import React from 'react'

export default function Footer() {
  return (
    <div className='container mx-auto'>
      <footer class="bg-white py-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className=' mx-auto'>
            <p class="font-bold text-2xl text-gray-900">Services</p>

            <ul class="mt-6 space-y-4 text-sm">
              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> 1on1 Coaching </a>
              </li>

              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> Company Review </a>
              </li>

              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> Accounts Review </a>
              </li>

              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> HR Consulting </a>
              </li>

              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> SEO Optimisation </a>
              </li>
            </ul>
          </div>

          <div className=' mx-auto'>
            <p class="font-bold text-2xl text-gray-900">Company</p>

            <ul class="mt-6 space-y-4 text-sm">
              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> About </a>
              </li>

              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> Meet the Team </a>
              </li>

              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> Accounts Review </a>
              </li>
            </ul>
          </div>

          <div className=' mx-auto'>
            <p class="font-bold text-2xl text-gray-900">Helpful Links</p>

            <ul class="mt-6 space-y-4 text-sm">
              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> Contact </a>
              </li>

              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> FAQs </a>
              </li>

              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> Live Chat </a>
              </li>
            </ul>
          </div>

          <div className=' mx-auto'>
            <p class="font-bold text-2xl text-gray-900">Legal</p>

            <ul class="mt-6 space-y-4 text-sm">
              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> Accessibility </a>
              </li>

              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> Returns Policy </a>
              </li>

              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> Refund Policy </a>
              </li>

              <li>
                <a href="#" class="text-gray-700 transition hover:opacity-75"> Hiring Statistics </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>

  )
}

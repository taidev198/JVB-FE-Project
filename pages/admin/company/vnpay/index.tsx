import Link from 'next/link';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';

const index = () => {
  return (
    <>
      <div>
        <div>
          <h1>Welcome, Adrian</h1>
          <p>Access & manage</p>

          <div>
            <div>
              <p>2 Bank Accounts</p>
              <p>Total Current Balance</p>
              <p>$2, 698.12</p>
            </div>
            <div>
              <Link href={''}>
                <AddIcon />
                Nạp tiền
              </Link>
            </div>
          </div>

          <div className="mb-4 flex items-center ">
            <h2 className="text-md font-bold text-gray-700">Recent transactions</h2>
            <button className="font-medium text-blue-600">View all</button>
          </div>

          <div className="mb-4 border-b border-gray-200">
            <ul className="flex space-x-4 text-sm">
              <li>
                <button className="border-b-2 border-blue-600 pb-1 font-medium text-blue-600">Chase Bank</button>
              </li>
              <li>
                <button className="text-gray-500">Bank of America</button>
              </li>
              <li>
                <button className="text-gray-500">First Platypus Bank</button>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-4 flex items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Chase Bank</h3>
                <p>$2,588.12</p>
              </div>
              <span className="text-xs font-medium text-gray-500">Savings</span>
            </div>

            <div>
              <table>
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Spotify</td>
                    <td>Alexa Doe</td>
                    <td>Spotify</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;

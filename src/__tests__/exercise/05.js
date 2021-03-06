// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {handlers} from 'test/server-handlers'
import Login from '../../components/login-submission'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})
const server = setupServer(...handlers)

  // rest.post(
  //   'https://auth-provider.example.com/api/login',
  //   async (req, res, ctx) => {
  //     if(!req.body.password) {
  //       return res(ctx.status(400), ctx.json({message: 'password required'}))
  //     }
  //     if(!req.body.username) {
  //       return res(ctx.status(400), ctx.json({message: 'username required'}))
  //     }
  //     return res(ctx.status(200), ctx.json({username: req.body.username}))
  //   },
  // )
  // )
beforeAll(()=> server.listen())
afterAll(()=> server.close())

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)
  // 🐨 uncomment this and you'll start making the request!
  userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(()=> screen.getByLabelText(/loading/i))

  expect(screen.getByText(username)).toBeInTheDocument()
})

test('omiting the password results in a error', async()=>{
  render(<Login />)
  const {username, password} =buildLoginForm()
  userEvent.type(screen.getByLabelText(/username/i), username)
  // not going to fill the password
  userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(()=> screen.getByLabelText(/loading/i))
  expect(screen.getByRole('alert')).toHaveTextContent('password required')
  // screen.debug()

})
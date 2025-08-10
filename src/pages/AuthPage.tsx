import { Box, Center, Flex, Heading, HStack, Icon, Input, Stack, Text } from '@chakra-ui/react'
import { NativeSelectRoot, NativeSelectField } from '@/components/ui/native-select'
import { ColorModeButton } from '@/components/ui/color-mode'
import { Field } from '@/components/ui/field'

import { SegmentedControl } from '@/components/ui/segmented-control'
import { PinInput } from '@/components/ui/pin-input'
import { Button } from '@/components/ui/button'
import { toaster } from '@/components/ui/toaster'
import { LuArrowLeft } from 'react-icons/lu'
import { LinkButton } from '@/components/ui/link-button'
import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  // Sign up always enforces both Google + Mobile OTP (no toggle needed)

  // Sign in state


  // Phone state (used in Sign Up flow)
  // New Sign Up form state
  const [suEmail, setSuEmail] = useState('')
  const [suUsername, setSuUsername] = useState('')
  const [suBoard, setSuBoard] = useState<'UPSC' | 'APPSC' | 'TGPSU' | 'SSC' | 'CURRENT_AFFAIRS' | 'OTHERS' | ''>('')
  const [suOtherBoard, setSuOtherBoard] = useState('')
  const [suOtpRequested2, setSuOtpRequested2] = useState(false)
  const [suOtp2, setSuOtp2] = useState('')

  const [phone, setPhone] = useState('')

  // Sign-in OTP state and resend timer
  const [suOtpRequested, setSuOtpRequested] = useState(false)
  const [suOtpValue, setSuOtpValue] = useState('')
  const [suResendIn, setSuResendIn] = useState<number>(0)


  const navigate = useNavigate()
  // simple countdown utility (defined before usage)
  const startCountdown = (setter: Dispatch<SetStateAction<number>>, seconds = 30) => {
    setter(seconds)
    let remaining = seconds
    const id = setInterval(() => {
      remaining -= 1
      if (remaining <= 0) { setter(0); clearInterval(id); return }
      setter(remaining)
    }, 1000)
  }






  // Sign-in OTP actions
  const onSendSuOtp = () => {
    if (!phone || phone.length < 10) {
      toaster.create({ title: 'Enter a valid mobile number', type: 'error' })
      return
    }
    setSuOtpRequested(true)
    startCountdown(setSuResendIn, 30)
    toaster.create({ title: 'OTP sent (demo)', description: `Sending to ${phone}` })
  }

  const onVerifySuOtp = () => {
    if (!suOtpRequested || suOtpValue.length < 6) {
      toaster.create({ title: 'Enter the 6-digit OTP', type: 'error' })
      return
    }
    // Persist username for greeting (fallback if none stored)
    const existing = localStorage.getItem('username')
    if (!existing) localStorage.setItem('username', 'User')
    toaster.create({ title: 'Signed in (demo)', type: 'success', description: 'Redirecting to chat…' })
    setTimeout(() => navigate('/chat'), 600)
  }




  return (
    <Flex minH="100dvh" align="center" justify="center" bg="bg.muted" px="4">
      <Box bg="bg" borderWidth="1px" borderRadius="2xl" w={{ base: 'full', md: 'lg' }} p={{ base: '5', md: '8' }} shadow="sm">
        <Stack gap="6">
          <HStack justify="space-between">
            <LinkButton href="/" variant="ghost" size="sm" display="inline-flex" alignItems="center">
              <Icon as={LuArrowLeft} me="2" /> Back to Chat
            </LinkButton>
            <HStack>
              <Text color="fg.subtle" fontSize="sm">Only two devices can access an account at once</Text>
              <ColorModeButton />
            </HStack>
          </HStack>

          <Stack gap="1" textAlign="center">
            <Heading size="xl">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</Heading>

          </Stack>

          <SegmentedControl
            items={[{ value: 'signin', label: 'Sign In' }, { value: 'signup', label: 'Sign Up' }]}
            value={mode}
            fitted
            onValueChange={(e) => setMode((e.value as 'signin' | 'signup'))}
          />

          <Stack gap="5">
            {mode === 'signin' ? (
              <Stack gap="4">

                <Stack gap="4">

                  <Field label="Mobile number" required helperText="We will send a 6‑digit code">
                    <Input type="tel" placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </Field>
                  {!suOtpRequested ? (
                    <Button size="lg" onClick={() => { onSendSuOtp(); startCountdown(setSuResendIn, 30); }}>Send OTP</Button>
                  ) : (
                    <Stack gap="3">
                      <Text fontSize="sm" color="fg.muted">Enter the code sent to your phone</Text>
                      <Center>
                        <PinInput count={6} inputProps={{ inputMode: 'numeric', onChange: (ev) => setSuOtpValue((ev.currentTarget as HTMLInputElement).value) }} />
                      </Center>
                      <Button size="lg" onClick={onVerifySuOtp}>Verify and sign in</Button>
                      <Text fontSize="xs" color="fg.muted">Resend in {suResendIn}s</Text>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            ) : (
              <Stack gap="5">
                {/* New Sign Up form: Email, Username, Board, Mobile, OTP */}
                <Field label="Email" required>
                  <Input type="email" placeholder="you@example.com" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} />
                </Field>

                <Field label="Username" required>
                  <Input type="text" placeholder="Your name" value={suUsername} onChange={(e) => setSuUsername(e.target.value)} />
                </Field>

                <Field label="Which exam are you preparing for?" required helperText="Select your board">
                  <NativeSelectRoot width="full">
                    <NativeSelectField value={suBoard} onChange={(e) => setSuBoard(e.target.value as any)}>
                      <option value="" disabled>Select a board</option>
                      <option value="UPSC">UPSC</option>
                      <option value="APPSC">APPSC</option>
                      <option value="TGPSU">TGPSU</option>
                      <option value="SSC">SSC</option>
                      <option value="CURRENT_AFFAIRS">CURRENT AFFAIRS</option>
                      <option value="OTHERS">OTHERS</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field>

                {suBoard === 'OTHERS' && (
                  <Field label="Specify board" required>
                    <Input type="text" placeholder="Enter your board / education type" value={suOtherBoard} onChange={(e) => setSuOtherBoard(e.target.value)} />
                  </Field>
                )}

                <Field label="Mobile number" required helperText="We will send a 6‑digit code">
                  <Input type="tel" placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Field>

                {!suOtpRequested2 ? (
                  <Button size="lg" onClick={() => {
                    if (!suEmail || !suUsername || !suBoard || (suBoard === 'OTHERS' && !suOtherBoard) || !phone) {
                      toaster.create({ title: 'Please fill all required fields', type: 'error' })
                      return
                    }
                    setSuOtpRequested2(true)
                    toaster.create({ title: 'OTP sent (demo)', description: `Sending to ${phone}` })
                  }}>Next</Button>
                ) : (
                  <Stack gap="3">
                    <Text fontSize="sm" color="fg.muted">Enter the code sent to your phone</Text>
                    <Center>
                      <PinInput count={6} inputProps={{ inputMode: 'numeric', onChange: (ev) => setSuOtp2((ev.currentTarget as HTMLInputElement).value) }} />
                    </Center>
                    <Button size="lg" onClick={() => {
                      if (suOtp2.length < 6) { toaster.create({ title: 'Enter the 6-digit OTP', type: 'error' }); return }
                      // Save username for greeting
                      localStorage.setItem('username', suUsername || 'User')
                      toaster.create({ title: 'Account created (demo)', type: 'success', description: 'Redirecting to chat…' })
                      setTimeout(() => navigate('/chat'), 600)
                    }}>Verify and Sign Up</Button>
                  </Stack>
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>
    </Flex>
  )
}


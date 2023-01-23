import { addNewSubscriber } from '@/server/services/buttondown/buttondown_service'

export async function createSubscription({ email }: { email: string }) {
	await addNewSubscriber({ email })
}

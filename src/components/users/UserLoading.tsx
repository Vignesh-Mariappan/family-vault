import { Card, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const UserLoading = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
        <div className="flex flex-row gap-4 justify-center flex-wrap">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} className="w-full max-w-84 bg-transparent">
              <CardContent className="flex flex-col items-center p-2">
                <Skeleton className="rounded-full w-20 h-20 mb-2  bg-background" />
                <Skeleton className="h-6 w-32 mb-2  bg-background" />
                <Skeleton className="h-10 w-32  bg-background" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  )
}

export default UserLoading
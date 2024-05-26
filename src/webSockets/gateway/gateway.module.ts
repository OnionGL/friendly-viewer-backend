import {Module} from '@nestjs/common'
import { Gateway } from './gateway';
import { UserService } from 'src/user/user.service';


@Module({
    providers: [Gateway]
})
export class GatewayModule {}
